import {ServiceConfig, TokenMode} from '@angular-boot/core';
import {RestServiceErrorPolicy} from '@angular-boot/util';

export class ServiceConfigImpl implements ServiceConfig {


    getUrl(): string {
        const url = window.location.host;
        if (url === '192.168.1.2:3030') {
            // return 'http://185.128.138.176:8081'; // server
            // return 'http://185.128.138.176:8585'; // test
            // return 'http://192.168.1.11:8585'; // masoud
            // return 'http://192.168.1.3:8585'; // shahin
        } else if (url === 'localhost:4200') {
            // return 'http://185.128.138.176:8081'; // server
           // return 'http://185.128.138.176:8585'; // test
              return 'http://localhost:8585'; // test
            // return 'http://192.168.1.11:8585'; // masoud
            // return 'http://192.168.1.3:8585'; // shahin
        } else if (url === '192.168.1.8:4200') {
            // return 'http://185.128.138.176:8081'; // server
            // return 'http://185.128.138.176:8585'; // test
            // return 'http://192.168.1.11:8585'; // masoud
            return 'http://192.168.1.3:8585'; // shahin
        } else if (url === '185.128.138.176:8090') {
            return 'http://185.128.138.176:8585'; // test
        } else if (url === '185.128.138.176') {
            return 'http://185.128.138.176:8081'; // server
        } else {
            return 'http://185.128.138.176:8585'; // test
            // return `http://${url.split(':')[0]}:8081`; // server-pm
        }
        // return 'http://136.243.160.134:8081';
        // return 'http://185.128.138.176:8081'; // server
        // return 'http://185.128.138.176:8585'; // test
        // return 'http://192.168.43.244:8081';
        // return 'http://192.168.137.27:8081';  // park
        // return 'http://localhost:8081';
        // return 'http://localhost:8585';

    }

    setToken(res: string): void {

    }

    getToken(): string {
        return sessionStorage.getItem('token');
    }

    getTokenMode(): TokenMode {
        return TokenMode.HEADER;
    }

    redirectToLoginPage(): any {
    }

    applyCustomPolicyToError(error: any): any {
        if (error.status === 401) {
            this.logOut();


        }
    }

    logOut() {
        sessionStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }

    applyCustomPolicyToResult(res: any): any {

    }

    getRestServiceErrorPolicy(): any {
        return RestServiceErrorPolicy.CUSTOM;

    }

    getRestServiceResultPolicy(): any {
    }
}
