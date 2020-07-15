"use strict";

const os = require("os");
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require("config-ini-parser").ConfigIniParser;

class ServerlessPlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.config = (this.serverless.service.custom && this.serverless.service.custom.awscredentials) || {};
        this.serverless.service.provider.environment = this.serverless.service.provider.environment || {};

        const profile = this.config.profile || "default";
        this.loadRegion(profile);
        this.loadCredentials(profile);
    }

    loadRegion(profile) {
        const file = this.getAwsConfigFile("config");
        const config = this.getSection(file, `profile ${profile}`);
        if (config) {
            const region = config["region"];

            this.log(`Setting AWS_REGION to ${region}`)
            this.serverless.service.provider.environment["AWS_REGION"] = region;
        }
    }

    loadCredentials(profile) {
        const file = this.getAwsConfigFile('credentials');
        const credentials = this.getSection(file, profile);
        if (credentials) {
            const accessKey = credentials["aws_access_key_id"];
            if (accessKey) {
                this.log(`Setting AWS_ACCESS_KEY_ID to ${this.redact(accessKey)}`);
                this.serverless.service.provider.environment["AWS_ACCESS_KEY_ID"] = accessKey;    
            }

            const secretKey = credentials["aws_secret_access_key"];
            if (secretKey) {
                this.log(`Setting AWS_SECRET_ACCESS_KEY to ${this.redact(secretKey)}`);
                this.serverless.service.provider.environment["AWS_SECRET_ACCESS_KEY"] = secretKey;    
            }
        }
    }

    getAwsConfigFile(name) {
        return `${os.homedir()}${path.sep}.aws${path.sep}${name}`;
    }

    getSection(file, section) {
        this.log(`Loading [${section}] from ${file}`);

        if (!fs.existsSync(file)) {
            this.log(`WARNING: ${file} not found.`);
            return;
        }

        const content = fs.readFileSync(file, 'utf-8');
        const parser = new ConfigIniParser(os.EOL);
        parser.parse(content);

        if (!parser.isHaveSection(section)) {
            this.log(`WARNING: ${section} not found in ${file}.`);
            return;
        }

        const result = {};
        parser.items(section).forEach(item => {
            result[item[0]] = item[1];
        });
        return result;
    }

    redact(value) {
        return `****************${value.substring(value.length - 4, value.length)}`;
    }

    log(message) {
        this.serverless.cli.log(`AWSCREDENTIALS: ${message}`);
    }
}

module.exports = ServerlessPlugin;
