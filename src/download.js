const { default: axios } = require('axios');
const { MAX_SIZE } = require('./config');

const CONTENT_TYPES = [
  'video/mp4',
  'audio/mp3',
];

function preflight(url) {
  return axios.head(url).then(({ headers }) => {
    let bytes = headers['content-length'];
    let type = headers['content-type'];
    if (!(type && CONTENT_TYPES.includes(type))) {
      throw { response: {
        status: 415,
        data: 'Invalid content type: ' + type,
      } };
    }
    if (bytes > MAX_SIZE) {
      let size = bytes / 1000 / 1024;
      throw { response: {
        status: 413,
        data: 'Exceeded download limit size: ' + size + ' MB',
      } };
    }
  });
}

function download(url) {
  return preflight(url).then(() => axios(url, {
    responseType: 'arraybuffer',
  }));
}

module.exports = download;
