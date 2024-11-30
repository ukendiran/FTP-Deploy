const ftp = require("basic-ftp");
const fs = require("fs");

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
        this.client.ftp.verbose = true; // Verbose for debug, set false in production
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

    async isFileUnchanged(localPath, remotePath) {
        try {
            const localStats = fs.statSync(localPath);
            const remoteStats = await this.client.size(remotePath).catch(() => null);

            if (remoteStats === null) {
                // File does not exist on the server
                return false;
            }

            // Check size equality
            if (localStats.size === remoteStats) {
                console.log(`Skipping unchanged file: ${localPath}`);
                return true;
            }

            return false;
        } catch (error) {
            console.warn(`Error checking file: ${localPath} -> ${remotePath}`, error);
            return false;
        }
    }

    async uploadFile(localPath, remotePath) {
        try {
            if (await this.isFileUnchanged(localPath, remotePath)) {
                return; // Skip unchanged file
            }

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
            await this.client.ensureDir(remoteDir);

            const entries = fs.readdirSync(localDir, { withFileTypes: true });

            for (const entry of entries) {
                const localPath = `${localDir}/${entry.name}`;
                const remotePath = `${remoteDir}/${entry.name}`;

                if (entry.isDirectory()) {
                    await this.uploadDirectory(localPath, remotePath);
                } else {
                    await this.uploadFile(localPath, remotePath);
                }
            }

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
