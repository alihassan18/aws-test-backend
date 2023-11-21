import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as mimeTypes from 'mime-types';
import { convertMarkupToString } from 'src/helpers/common.helpers';
@Injectable()
export class LinkedinService {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private baseUri: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.clientId =
            this.configService.get<string>('LINKEDIN_CLIENT_ID') ||
            process.env.LINKEDIN_CLIENT_ID;
        this.clientSecret =
            this.configService.get<string>('LINKEDIN_CLIENT_SECRET') ||
            process.env.LINKEDIN_CLIENT_SECRET;
        this.baseUri =
            this.configService.get<string>('BASE_URL') || process.env.BASE_URL;
        this.redirectUri = this.baseUri + '/auth/linkedin/callback';
    }

    async getAccessToken(code: string): Promise<string> {
        try {
            const response = await lastValueFrom(
                this.httpService.post(
                    'https://www.linkedin.com/oauth/v2/accessToken',
                    null,
                    {
                        params: {
                            grant_type: 'authorization_code',
                            code,
                            redirect_uri: `${this.redirectUri}`,
                            client_id: this.clientId,
                            client_secret: this.clientSecret
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                )
            );

            console.log('response.data', response.data);
            return response.data.access_token;
        } catch (error) {
            // console.log('getAccessToken', error);
        }
    }

    async getUserLinkedInId(accessToken: string): Promise<string> {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const response = await lastValueFrom(
                this.httpService.get('https://api.linkedin.com/v2/me', {
                    headers
                })
            );

            return response.data.id;
        } catch (error) {
            // console.log('getUserLinkedInId', error);
        }
    }

    // async postOnLinkedIn(
    //     accessToken: string,
    //     text: string,
    //     imagePath?: string
    // ): Promise<void> {
    //     console.log({ accessToken, text, imagePath });

    //     try {
    //         const linkedInId = await this.getUserLinkedInId(accessToken);

    //         const headers = {
    //             Authorization: `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json'
    //         };

    //         let media: any[] = [];

    //         if (imagePath) {
    //             const assetUrn = await this.uploadImageToLinkedIn(
    //                 accessToken,
    //                 imagePath,
    //                 linkedInId
    //             );
    //             media = [
    //                 {
    //                     status: 'READY',
    //                     media: assetUrn
    //                 }
    //             ];
    //         }

    //         const body = {
    //             author: `urn:li:person:${linkedInId}`,
    //             lifecycleState: 'PUBLISHED',
    //             specificContent: {
    //                 'com.linkedin.ugc.ShareContent': {
    //                     shareCommentary: {
    //                         text
    //                     },
    //                     shareMediaCategory: imagePath ? 'IMAGE' : 'NONE',
    //                     media
    //                 }
    //             },
    //             visibility: {
    //                 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    //             }
    //         };

    //         await lastValueFrom(
    //             this.httpService.post(
    //                 'https://api.linkedin.com/v2/ugcPosts',
    //                 body,
    //                 { headers }
    //             )
    //         );
    //     } catch (error) {
    //         console.error('Error posting on LinkedIn:', error);
    //     }
    // }

    async postOnLinkedIn(accessToken: string, text: string): Promise<void> {
        try {
            const content = convertMarkupToString(text);
            const linkedInId = await this.getUserLinkedInId(accessToken);

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const body = {
                author: `urn:li:person:${linkedInId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: content
                        },
                        shareMediaCategory: 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };

            await lastValueFrom(
                this.httpService.post(
                    'https://api.linkedin.com/v2/ugcPosts',
                    body,
                    { headers }
                )
            );
        } catch (error) {
            console.error('Error posting on LinkedIn:', error);
            // console.log('postOnLinkedIn', error);
        }
    }

    async uploadImageToLinkedIn(
        accessToken: string,
        imageUrl: string,
        linkedInId: string
    ): Promise<string> {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const registerUploadResponse = await lastValueFrom(
            this.httpService.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                        owner: `urn:li:person:${linkedInId}`,
                        serviceRelationships: [
                            {
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent'
                            }
                        ]
                    }
                },
                { headers }
            )
        );

        const uploadUrl =
            registerUploadResponse.data.value.uploadMechanism[
                'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
            ].uploadUrl;
        const assetUrn = registerUploadResponse.data.value.asset;

        const imageResponse = await lastValueFrom(
            this.httpService.get(imageUrl, { responseType: 'arraybuffer' })
        );
        const imageBuffer = Buffer.from(imageResponse.data);
        const imageContentType = mimeTypes.lookup(imageUrl);

        await lastValueFrom(
            this.httpService.put(uploadUrl, imageBuffer, {
                headers: {
                    'Content-Type': imageContentType
                },
                maxRedirects: 0
            })
        );

        return assetUrn;
    }

    async getLinkedInAuthUrl(state: string): Promise<string> {
        const scope = 'r_liteprofile w_member_social';

        // w_member_file
        return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}&scope=${scope}`;
    }

    // async postOnLinkedIn(code: string, text: string): Promise<void> {
    //     const accessToken = await this.linkedinService.getAccessToken(code);
    //     await this.linkedinService.postOnLinkedIn(accessToken, text);
    // }
}
