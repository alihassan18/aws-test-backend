import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WSJwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('calle');

        const client = context.switchToWs().getClient();
        const { handshake } = client;

        try {
            const token = handshake.query.token;
            console.log(token);

            if (!token) {
                throw new WsException('Un');
            }
            // Replace the following line with your actual authentication logic.
            // const user = await this.authService.validateToken(
            //     handshake.query.token
            // );
            const user = null;

            if (!user) {
                return false;
            }

            // Store the userId in the client object for later use.
            client.userId = user.id; // Replace 'user.id' with the appropriate property for your user object.
            return true;
        } catch (error) {
            return false;
        }
    }
}
