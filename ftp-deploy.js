const ftp = require("basic-ftp");

class FTPDeploy {
    constructor(config) {
        this.host = config.host;
        this.user = config.user;
        this.password = config.password;
        this.secure = config.secure || false;
        this.port = config.port || 21;
    }

    async connect() {
        this.client = new ftp.Client();
        this.client.ftp.verbose = true; // Set to false in production for less logging
        try {
            await this.client.access({
                host: this.host,
                user: this.user,
                password: this.password,
                secure: this.secure,
                port: this.port,
            });
            console.log("Connected to FTP server.");
        } catch (error) {
            console.error("Failed to connect:", error);
            throw error;
        }
    }

    async uploadFile(localPath, remotePath) {
        try {
            console.log(`Uploading file: ${localPath} -> ${remotePath}`);
            await this.client.uploadFrom(localPath, remotePath);
            console.log("File uploaded successfully.");
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    }

    async uploadDirectory(localDir, remoteDir) {
        try {
            console.log(`Uploading directory: ${localDir} -> ${remoteDir}`);
            await this.client.uploadFromDir(localDir, remoteDir);
            console.log("Directory uploaded successfully.");
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    }

    async disconnect() {
        try {
            this.client.close();
            console.log("Disconnected from FTP server.");
        } catch (error) {
            console.error("Error disconnecting:", error);
        }
    }
}

module.exports = FTPDeploy;
