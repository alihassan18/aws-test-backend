import axios from 'axios';

export class ZackService {
    private api_path: string;
    private app_id: string;
    private app_sec: string;
    private app_token: string;

    constructor() {
        this.api_path = process.env.ZACK_SERVER_API;
        this.app_id = process.env.ZACK_APP_ID;
        this.app_sec = process.env.ZACK_APP_SEC;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAccessToken(): Promise<any> {
        try {
            const url = `${this.api_path}/auth/login`;
            const postData = {
                app_id: this.app_id,
                app_sec: this.app_sec
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await axios.post<any>(url, postData, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });
            this.app_token = data ? data.token : null;
            return data && data.token ? true : false;
        } catch (error) {
            console.log('getAccessToken', error);
            return false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async sendMessagePrivate(postData: any): Promise<any> {
        try {
            const url = `${this.api_path}/message/create-private-message`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await axios.post<any>(url, postData, {
                headers: {
                    'x-auth-token': this.app_token,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });
            console.log('sendMessage Success', data);
            return (data && data.status) || 100;
        } catch (error) {
            console.log('sendMessageError', error);
            return null;
        }
    }
}
