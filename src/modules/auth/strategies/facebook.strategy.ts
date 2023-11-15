// facebook.strategy.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, Profile } from 'passport-facebook';
import { USERS } from 'src/constants/db.collections';
import { jwtConstants } from 'src/constants/jwt.constant';
import { UserDocument } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        @InjectModel(USERS) readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
            scope: 'email',
            profileFields: ['id', 'email', 'name']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: Error | null, user?: UserDocument) => void
    ): Promise<void> {
        const { email, first_name, last_name, id } = profile._json;

        // const user = await this.userService.userModel.findOrCreate({
        //     email,
        //     firstName: first_name,
        //     lastName: last_name,
        //     facebookId: profile.id,
        //     facebookAccessToken: accessToken
        // });

        // Check if user already exists in the database
        let user = await this.userService.getUserByFacebookId(id);
        if (!user) {
            // const name = _json?.name?.split(' ');
            // Create new user in the database if user doesn't exist
            user = await this.userModel.create({
                facebookId: id,
                // userName: username,
                email: email,
                firstName: first_name,
                lastName: last_name,
                facebookAccessToken: accessToken,
                facebookAccessSecret: refreshToken

                // avatar: _json.profile_image_url
            });
        } else {
            // Update user's access token and access secret if user already exists
            user.facebookAccessToken = accessToken;
            user.facebookAccessSecret = refreshToken;
            user = await user.save();
        }

        // Generate JWT access token for user
        const payload = {
            _id: user._id,
            facebookId: id,
            // username,
            email: email
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: 60 * 15
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        done(null, { user, token });
    }
}
