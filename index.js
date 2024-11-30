const core = require("@actions/core");
const FTPDeploy = require("./ftp-deploy");

async function run() {
    try {
        // Get inputs from action.yml
        const host = core.getInput("host");
        const user = core.getInput("user");
        const password = core.getInput("password");
        const secure = core.getBooleanInput("secure");
        const localPath = core.getInput("local_path");
        const remotePath = core.getInput("remote_path");
        const isDirectory = core.getBooleanInput("is_directory");

        const deployer = new FTPDeploy({ host, user, password, secure });

        await deployer.connect();

        if (isDirectory) {
            await deployer.uploadDirectory(localPath, remotePath);
        } else {
            await deployer.uploadFile(localPath, remotePath);
        }

        core.info("FTP deployment successful.");
    } catch (error) {
        core.setFailed(`FTP deployment failed: ${error.message}`);
    }
}

run();
