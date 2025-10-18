import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { capitalize } from '../functions';

/**
 * Command: CI4 Make Model
 * Description:
 * Creates a new CI4 model file with proper namespace, structure, and naming conventions.
 */
export async function makeModelFile() {
    try {
        // 🏠 Ensure workspace is open
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage("No workspace folder found. Please open your CodeIgniter 4 project first.");
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const basePath = path.join(workspacePath, "app", "Models");

        // 🧾 Ask for model name (e.g., test/user or post)
        const modelInput = await vscode.window.showInputBox({
            prompt: "Enter model name (e.g., test/user or post)",
            placeHolder: "Example: test/user or post"
        });

        if (!modelInput) {
            vscode.window.showErrorMessage("Model name is required.");
            return;
        }

        // 🧠 Parse input
        const parts = modelInput.split('/');
        const rawModelName = parts.pop() as string; // Last part (e.g., user)
        const folderPath = path.join(basePath, ...parts.map(p => capitalize(p))); // e.g., app/Models/Test
        const modelName = capitalize(rawModelName) + 'Model'; // e.g., UserModel
        const filePath = path.join(folderPath, `${modelName}.php`);

        // 🧩 Build namespace
        const namespace =
            parts.length > 0
                ? `App\\${parts.map(p => capitalize(p)).join('\\')}\\Models`
                : 'App\\Models';

        // 📦 Generate table name (lowercase plural)
        const tableName = rawModelName.toLowerCase() + 's';

        // 📝 Default content
        const content = `<?php namespace ${namespace};

use CodeIgniter\\Model;

class ${modelName} extends Model
{
    protected $table = '${tableName}';
    protected $primaryKey = 'id';
    protected $allowedFields = [];

    // Define validation rules, relationships, or custom methods here
}
`;

        // 📁 Create folder if it doesn’t exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            vscode.window.showInformationMessage(`📂 Folder created: ${folderPath}`);
        }

        // ⚠️ Prevent overwriting existing model
        if (fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`⚠️ Model "${modelName}" already exists.`);
            return;
        }

        // 💾 Write model file
        fs.writeFileSync(filePath, content, 'utf8');

        // 📖 Open file in VS Code
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);

        // ✅ Success
        vscode.window.showInformationMessage(`✅ Model "${modelName}" created successfully in ${folderPath}.`);

    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Error creating model: ${error.message}`);
        console.error(error);
    }
}
