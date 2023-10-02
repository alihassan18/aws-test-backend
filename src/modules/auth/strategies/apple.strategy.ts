import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-apple';
import { User, UserDocument } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {
        super({
            clientID: process.env.APPLE_CLIENT_ID,
            teamID: process.env.APPLE_TEAM_ID,
            callbackURL: process.env.APPLE_CALLBACK_URL,
            keyID: process.env.APPLE_KEY_ID,
            privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
            passReqToCallback: true,
            scope: ['name', 'email']
        });
    }

    async validate(request, accessToken, refreshToken, profile, done) {
        // Implement your logic to create or retrieve a user from the database
        // based on the Apple profile
        let user = await this.userModel
            .findOne({
                $or: [{ appleId: profile.id }, { email: profile.email }]
            })
            .exec();
        const name = profile.name;
        if (!user) {
            user = new this.userModel({
                appleId: profile.id,
                email: profile.email,
                firstName: name,
                lastName: name
                // Add any other user properties you want to store in the database
            });
            await user.save();
        }

        return done(null, user);
    }
}
