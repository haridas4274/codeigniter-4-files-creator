import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { makeViewFile } from './commands/makeViewFile';
import { makeModelFile } from './commands/makeModelFile';
import { makeControllerFile } from './commands/makeControllerFile';
import { makeControllerFileAll } from './commands/makeControllerFileAll';
import { makeServiceFile } from './commands/makeServiceFile';
import { makeCi4Route } from './commands/makeCi4Route';
import { ViewDefinitionProvider } from './features/viewDefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('✅ CodeIgniter 4 Files Creator extension activated.');
    // CI4 View Command
    const makeViewCmd = vscode.commands.registerCommand('make.ci4_view', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeViewFile();
    });
    // CI4 View Command
    const makeModelCmd = vscode.commands.registerCommand('make.ci4_model', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeModelFile();
    });
    const makeControllerCmd = vscode.commands.registerCommand('make.ci4_controller', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeControllerFile();
    });
    const makeControllerAllCmd = vscode.commands.registerCommand('make.ci4_controller_all', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeControllerFileAll();
    });
    const makeServiceCmd = vscode.commands.registerCommand('make.ci4_service', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeServiceFile();
    });

    // route files
   const makeRouteGet = vscode.commands.registerCommand('make.ci4_route_get', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeCi4Route('get');
    });

    const makeRoutePost = vscode.commands.registerCommand('make.ci4_route_post', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeCi4Route('post');
    });

    const makeRoutePut = vscode.commands.registerCommand('make.ci4_route_put', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeCi4Route('put');
    });

    const makeRouteDelete = vscode.commands.registerCommand('make.ci4_route_delete', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeCi4Route('delete');
    });

    const makeRoutePatch = vscode.commands.registerCommand('make.ci4_route_patch', async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showErrorMessage('Please open a CI4 project folder first.');
            return;
        }
        await makeCi4Route('patch');
    });
    const ViewDefinitionProviderCmd =  vscode.languages.registerDefinitionProvider(
        { language: 'php', scheme: 'file' },
        new ViewDefinitionProvider()
    );


    // Providers

    context.subscriptions.push(makeViewCmd, makeModelCmd, makeControllerCmd, makeControllerAllCmd, makeServiceCmd,makeRouteGet,makeRoutePost,makeRoutePut,makeRouteDelete,makeRoutePatch,ViewDefinitionProviderCmd);
}
export function deactivate() { }
