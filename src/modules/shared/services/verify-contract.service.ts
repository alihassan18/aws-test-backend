import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class VerifyContractService {
    constructor(private httpService: HttpService) {}

    async verifyEthContract(
        contractAddress: string,
        sourceCode: string,
        compilerVersion: string,
        contractName: string,
        optimizerEnabled = 0,
        runs = 200
    ): Promise<unknown> {
        const apiKey = 'U42GHEJ222KB18IABPRT3MIQEB4H9NS8PK';
        const network = 'mainnet'; // Change to ropsten, rinkeby, etc. if you're on a testnet
        const apiUrl = `https://api${
            network !== 'mainnet' ? '-' + network : ''
        }.etherscan.io/api`;

        const params = new URLSearchParams({
            apikey: apiKey,
            module: 'contract',
            action: 'verifysourcecode',
            contractaddress: contractAddress,
            sourceCode: sourceCode,
            contractname: contractName,
            compilerversion: compilerVersion,
            optimizationUsed: String(optimizerEnabled),
            runs: String(runs),
            licenseType: '1'
        });

        const urlWithParams = `${apiUrl}?${params.toString()}`;

        const { data }: AxiosResponse<unknown> = await this.httpService
            .get(urlWithParams)
            .toPromise();
        return data;
    }

    async verifyBscContract(
        contractAddress: string,
        sourceCode: string,
        compilerVersion: string,
        contractName: string,
        optimizerEnabled = 0,
        runs = 200,
        network = 'mainnet'
    ): Promise<unknown> {
        const apiKey = 'Your BscScan API Key';

        // Adjust the apiUrl based on the network
        const apiUrl = `https://api${
            network !== 'mainnet' ? '-' + network : ''
        }.bscscan.com/api`;

        const params = new URLSearchParams({
            apikey: apiKey,
            module: 'contract',
            action: 'verifysourcecode',
            contractaddress: contractAddress,
            sourceCode: sourceCode,
            contractname: contractName,
            compilerversion: compilerVersion,
            optimizationUsed: String(optimizerEnabled),
            runs: String(runs),
            licenseType: '1'
        });

        const urlWithParams = `${apiUrl}?${params.toString()}`;

        const { data } = await this.httpService.get(urlWithParams).toPromise();
        return data;
    }
}
