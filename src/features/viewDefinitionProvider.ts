import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ViewDefinitionProvider implements vscode.DefinitionProvider {
    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.Location | undefined> {
        const config = vscode.workspace.getConfiguration('ci4FilesCreator');
        const enable = config.get<boolean>('enableViewNavigation');
        if (!enable) return;

        const fileExtension = config.get<string>('fileExtension') || '.php';
        const defaultFolder = config.get<string>('defaultFolder') || 'app/Views';
        const viewTemplate = config.get<string>('viewTemplate') || '';
        const authorName = config.get<string>('authorName') || 'Unknown Author';

        const lineText = document.lineAt(position).text;
        const regex = /view\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(lineText)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            if (position.character >= start && position.character <= end) {
                const viewPath = match[1]; // post/index or admin/post
                const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                if (!workspaceFolder) return;

                const fullPath = path.join(workspaceFolder, defaultFolder, `${viewPath}${fileExtension}`);
                const folderPath = path.dirname(fullPath);

                // create folder if missing
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                // create file if missing
                if (!fs.existsSync(fullPath)) {
                    fs.writeFileSync(fullPath, `<!--\n * Author: ${authorName}\n * Created: ${new Date().toLocaleString()}\n */\n\n${viewTemplate}`);
                }

                return new vscode.Location(vscode.Uri.file(fullPath), new vscode.Position(0, 0));
            }
        }

        return undefined;
    }
}
