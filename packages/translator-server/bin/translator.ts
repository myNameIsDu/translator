#!/usr/bin/env node
import { Command, runExit } from 'clipanion';
import { execSync } from 'child_process';
import path from 'path';

const serverPath = path.resolve(__dirname, '../server.js');
const binPath = path.resolve(__dirname, '../node_modules/.bin');
runExit([
    class ServerCommand extends Command {
        static paths = [['server'], Command.Default];
        async execute(): Promise<number | void> {
            execSync(` ${binPath}/cross-env NODE_ENV=production node ${serverPath}`, {
                stdio: 'inherit',
            });
        }
    },

    class DevCommand extends Command {
        static paths = [['dev']];
        async execute(): Promise<number | void> {
            execSync(
                // nodeman 默认监听当前工作目录，所以这里要指定监听的路径
                `${binPath}/cross-env NODE_ENV=development ${binPath}/nodemon ${serverPath} --watch ${serverPath}`,
                {
                    stdio: 'inherit',
                },
            );
        }
    },
]);
