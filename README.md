# FTP-Deploy

This GitHub Action allows you to deploy files or directories to an FTP server.

## Inputs

| Name          | Description                          | Required | Default  |
|---------------|--------------------------------------|----------|----------|
| `host`        | FTP server hostname                 | Yes      |          |
| `user`        | FTP username                        | Yes      |          |
| `password`    | FTP password                        | Yes      |          |
| `secure`      | Use secure connection (true/false)  | No       | `false`  |
| `local_path`  | Local file or directory to upload   | Yes      |          |
| `remote_path` | Remote file or directory path       | Yes      |          |
| `is_directory`| Indicate if the local path is a directory | No   | `false`  |

## Example Usage

```yaml
name: FTP Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: FTP Deploy
        uses: your-username/ftp-deploy-action@v1
        with:
          host: ${{ secrets.FTP_HOST }}
          user: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local_path: "./build"
          remote_path: "/remote/path"
          is_directory: true
