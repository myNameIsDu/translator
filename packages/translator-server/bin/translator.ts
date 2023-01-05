#!/usr/bin/env node
import { Command, runExit } from 'clipanion';
import start from '../server';

runExit(
    class ServerCommand extends Command {
        static paths = [['server'], Command.Default];
        async execute(): Promise<number | void> {
            process.env.NODE_ENV = 'production';
            start();
        }
    },
);
