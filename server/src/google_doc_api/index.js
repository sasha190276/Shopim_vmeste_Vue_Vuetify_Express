const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json';

const credentials = {
  installed: {
    client_id: '985449641102-cq7mbpcb1k24mh29818f8rrkhpakgrfi.apps.googleusercontent.com',
    project_id: 'quickstart-1560421336997',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: 'TGRMnnAnyjJpPsU-CRt1pPr1',
    redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'],
  },
};
const token = {
  access_token: 'ya29.GlsnB5PRRJ9dpa--xqmvdFp4gCNjb6NdiJg9ZoATKdmsAU_QF4EOI1158mw0n9cMgy2Es6U-fg-agCMj5JZTe6Vc71JUz_jndU7thTaoaZHAlI9jRmpiyxx3IUc5',
  refresh_token: '1/jD0rfWNeK2DG-YLVuDN55ZZ7a_l98lPl8RNTrPwGo8M',
  scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  token_type: 'Bearer',
  expiry_date: 1560425966680,
};


module.exports = {
  getSheet(params) {
    //console.log(i);
    return new Promise(((resolve, reject) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0],
      );
      oAuth2Client.setCredentials(token);
      const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
      sheets.spreadsheets.values.get(params, (err, res) => {
        if (err) reject(err);
        resolve(res.data.values);
      });
    }));
  },
};

/*
{
  spreadsheetId: '1dc1Xw5C_YTBN5nHrR_f33lvckRw8OH_WAmrmdCiNarc',
    range: 'A2:h',
} */
