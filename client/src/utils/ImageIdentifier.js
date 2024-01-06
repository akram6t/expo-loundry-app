
export const ImageIdentifier = (url, server) => {

        if (url.includes('http://') || url.includes('https://') || url.includes('data:')) {
            return url;
        } else {
            return server.baseUrl + url;
        }
};
