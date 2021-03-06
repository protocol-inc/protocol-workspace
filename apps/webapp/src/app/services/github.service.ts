import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGitHubBranch, IGithubComment, IGitHubRepo, IGitHubUser } from '@gitcode/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as UrlAssembler from 'url-assembler';

// import * as sha1 from 'js-sha1';

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  private baseApiUrl = `https://api.github.com`;
  // private accessToken: string;
  // private requestHeaders;

  constructor(private http: HttpClient) {
    // if (localStorage.getItem('githubAccessToken')) {
    //   this.AccessToken = localStorage.getItem('githubAccessToken');
    // }
  }

  // public get AccessToken(): string {
  //   return this.accessToken;
  // }

  public set AccessToken(token: string) {
    // this.accessToken = token;
    localStorage.setItem('githubAccessToken', token);
  }

  private getHeaders(): any {
    const accessToken = localStorage.getItem('githubAccessToken');
    return new HttpHeaders(
      { 'Authorization': `token ${accessToken}` },
    );
  }

  public getUser(): Observable<IGitHubUser> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/user`)
      .toString();

    return this.http.get<IGitHubUser>(endpoint, { headers: this.getHeaders() });
  }

  public getRepositories(userName: string): Observable<IGitHubRepo[]> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/users/${userName}/repos`)
      .toString();

    return this.http.get<IGitHubRepo[]>(endpoint, { headers: this.getHeaders() });
  }

  public getAuthenticatedUserRepositories(): Observable<IGitHubRepo[]> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/user/repos`)
      .toString();

    return this.http.get<IGitHubRepo[]>(endpoint, { headers: this.getHeaders() });
  }

  public getBranches(owner: string, repo: string): Observable<IGitHubBranch[]> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/branches`)
      .toString();

    return this.http.get<IGitHubBranch[]>(endpoint, { headers: this.getHeaders() });
  }

  public getRepoComments(owner: string, repo: string): Observable<IGithubComment[]> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/comments`)
      .toString();

    return this.http.get<IGithubComment[]>(endpoint, { headers: this.getHeaders() });
  }

  public getPRComments(commentsUrl: string, pageSize?: number, pageNumber?: number): Observable<IGithubComment[]> {
    let endpointBuilder = UrlAssembler(commentsUrl);
    if (pageSize && pageNumber) {
      endpointBuilder = endpointBuilder.query({
        per_page: pageSize,
        page: pageNumber,
      });
    }

    const endpoint = endpointBuilder.toString();

    return this.http.get<IGithubComment[]>(endpoint, { headers: this.getHeaders() });
  }

  public createPR(owner: string, repo: string, payload: any): Observable<any> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/pulls`)
      .toString();

    return this.http.post<any>(endpoint, payload, { headers: this.getHeaders() });
  }

  public getWebhook(owner: string, repo: string): Observable<any> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/hooks`)
      .toString();

    return this.http.get<any>(endpoint, { headers: this.getHeaders() });
  }

  public addWebhook(owner: string, repo: string, payload: any): Observable<any> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/hooks`)
      .toString();

    return this.http.post<any>(endpoint, payload, { headers: this.getHeaders() });
  }

  public async getRef(owner: string, repo: string, branchName: string): Promise<any> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/git/ref/heads/${branchName}`)
      .toString();

    return this.http.get<any>(endpoint, { headers: this.getHeaders() }).toPromise();
  }

  public async createBranch(owner: string, repo: string, branchName: string, refSha: string): Promise<any> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/git/refs`)
      .toString();

    const payload = {
      ref: `refs/heads/${branchName}`,
      sha: refSha,
    };

    return this.http.post<any>(endpoint, payload, { headers: this.getHeaders() }).toPromise();
  }

  public getRepoLanguages(owner: string, repo: string): Observable<string[]> {
    const endpoint = UrlAssembler(this.baseApiUrl)
      .template(`/repos/${owner}/${repo}/languages`)
      .toString();

    return this.http.get<object>(endpoint, { headers: this.getHeaders() })
               .pipe(
                 map((res) => {
                   const keys = Object.keys(res);
                   return keys.slice(0, 4);
                 }),
               );
  }
}
