import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function makeServiceFile() {
  try {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter Service name (e.g., Post or Admin/Post)',
      placeHolder: 'Example: Blog/Post',
    });

    if (!input) {
      vscode.window.showWarningMessage('⚠️ Service name is required.');
      return;
    }

    // Base directory for CI4 Services
    const baseDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    const servicesDir = path.join(baseDir, 'app', 'Services');

    // Split by slash to handle subfolders
    const parts = input.split('/');
    const className = parts.pop()!;
    const namespacePath = parts.join('\\');
    const folderPath = path.join(servicesDir, ...parts);

    // Ensure the directory exists
    fs.mkdirSync(folderPath, { recursive: true });

    // Proper class name & filename
    const classNameProper = `${className.charAt(0).toUpperCase() + className.slice(1)}Service`;
    const fileName = `${classNameProper}.php`;
    const filePath = path.join(folderPath, fileName);

    // Define namespace
    const namespace =
      parts.length > 0
        ? `App\\Services\\${namespacePath}`
        : 'App\\Services';

    // Prefilled CI4 Service boilerplate
    const content = `<?php

namespace ${namespace};

use App\\Services\\BaseService;

class ${classNameProper} extends BaseService
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Example: Fetch all records
     */
    public function getAll()
    {
        // TODO: implement logic
    }

    /**
     * Example: Find record by ID
     */
    public function find($id)
    {
        // TODO: implement logic
    }

    /**
     * Example: Create new record
     */
    public function create(array $data)
    {
        // TODO: implement logic
    }

    /**
     * Example: Update record
     */
    public function update($id, array $data)
    {
        // TODO: implement logic
    }

    /**
     * Example: Delete record
     */
    public function delete($id)
    {
        // TODO: implement logic
    }
}
`;
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    vscode.window.showInformationMessage(`✅ Service created: ${fileName}`);
    vscode.workspace.openTextDocument(filePath).then((doc) => {
      vscode.window.showTextDocument(doc);
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`❌ Error creating service: ${error.message}`);
    console.error(error);
  }
}
