import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { capitalize } from '../functions';

/**
 * Command: CI4 Make Controller
 * Description:
 * Creates a new CodeIgniter 4 controller file with proper namespace and class structure.
 */
export async function makeControllerFile() {
    try {
        // 🏠 Ensure workspace is open
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage("No workspace folder found. Please open your CodeIgniter 4 project first.");
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const basePath = path.join(workspacePath, "app", "Controllers");

        // 🧾 Ask for controller name (e.g., admin/user or home)
        const controllerInput = await vscode.window.showInputBox({
            prompt: "Enter controller name (e.g., admin/user or home)",
            placeHolder: "Example: admin/user or home"
        });

        if (!controllerInput) {
            vscode.window.showErrorMessage("Controller name is required.");
            return;
        }

        // 🧠 Parse input
        const parts = controllerInput.split('/');
        const rawControllerName = parts.pop() as string;
        const folderPath = path.join(basePath, ...parts.map(p => capitalize(p))); // e.g., app/Controllers/Admin
        const controllerName = capitalize(rawControllerName); // e.g., User
        const filePath = path.join(folderPath, `${controllerName}.php`);

        // 🧩 Build namespace
        const namespace =
            parts.length > 0
                ? `App\\${parts.map(p => capitalize(p)).join('\\')}\\Controllers`
                : 'App\\Controllers';

        // 📝 Default content
        const content = `<?php namespace ${namespace};

use App\\Controllers\\BaseController;

class ${controllerName} extends BaseController
{
    public function index()
    {
        return view('${controllerInput.toLowerCase()}');
    }
}
`;

        // 📁 Create folder if it doesn’t exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            vscode.window.showInformationMessage(`📂 Folder created: ${folderPath}`);
        }

        // ⚠️ Prevent overwriting existing file
        if (fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`⚠️ Controller "${controllerName}" already exists.`);
            return;
        }

        // 💾 Write controller file
        fs.writeFileSync(filePath, content, 'utf8');

        // 📖 Open file in VS Code
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);

        // ✅ Success message
        vscode.window.showInformationMessage(`✅ Controller "${controllerName}" created successfully in ${folderPath}.`);

    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Error creating controller: ${error.message}`);
        console.error(error);
    }
}