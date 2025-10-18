import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
/**
 * Command: CI4 Make View
 * Description: Creates a new CI4 view file in the CodeIgniter 4 project structure.
 */
export async function makeViewFile() {
    try {
        // 🔧 Load user-defined settings
        const config = vscode.workspace.getConfiguration('ci4FilesCreator');
        const fileExtension = config.get<string>('fileExtension') || '.php';
        const defaultFolder = config.get<string>('defaultFolder') || 'app/Views';
        const viewTemplate = config.get<string>('viewTemplate') || '';
        const authorName = config.get<string>('authorName') || 'Unknown Author';

        // 🏠 Ensure workspace is open
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage("No workspace folder found. Please open your CodeIgniter 4 project first.");
            return;
        }
        const workspacePath = workspaceFolders[0].uri.fsPath;

        // 📄 Ask for view path (e.g., admin/index or dashboard/home)
        const viewInput = await vscode.window.showInputBox({
            prompt: "Enter the view path (example: admin/index or home)",
            placeHolder: "admin/index"
        });

        if (!viewInput || viewInput.trim() === '') {
            vscode.window.showErrorMessage("View name/path is required.");
            return;
        }

        // 🧭 Build full path: "app/Views/admin/index.php"
        const viewRelativePath = viewInput.replace(/\\/g, '/'); // normalize slashes
        const targetDir = path.join(workspacePath, defaultFolder, path.dirname(viewRelativePath));
        const fileName = path.basename(viewRelativePath);
        const fullFilePath = path.join(targetDir, `${fileName}${fileExtension}`);

        // 🛠️ Create folder structure if missing
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            vscode.window.showInformationMessage(`📂 Created folder: ${path.relative(workspacePath, targetDir)}`);
        }

        // ⚠️ Prevent overwriting existing files
        if (fs.existsSync(fullFilePath)) {
            vscode.window.showWarningMessage(`⚠️ The view "${fileName}${fileExtension}" already exists!`);
            return;
        }

        // 📝 Prepare file content
        const header = `<!--\nAuthor: ${authorName}\nCreated: ${new Date().toLocaleString()}\n-->\n\n`;
        const content = `${header}${viewTemplate}\n`;

        // 💾 Write file
        fs.writeFileSync(fullFilePath, content, { encoding: 'utf8' });

        // 📖 Open created file
        const document = await vscode.workspace.openTextDocument(fullFilePath);
        await vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(`✅ View "${viewInput}${fileExtension}" created successfully!`);

    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Error creating view: ${error.message}`);
        console.error(error);
    }
}
