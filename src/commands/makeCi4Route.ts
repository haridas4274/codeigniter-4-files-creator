import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate CI4 route line (GET/POST/PUT/DELETE/PATCH)
 * Example:
 * $routes->group('admin', function($routes) {
 *     $routes->get('dashboard', 'Admin::dashboard');
 * });
 */
export async function makeCi4Route(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
) {
  try {
    // Ask route path input
    const routeInput = await vscode.window.showInputBox({
      prompt: `Enter route path (e.g. blog/list or admin/dashboard) for ${method.toUpperCase()}`,
      placeHolder: 'Example: test/index or product/store'
    });

    if (!routeInput) {
      vscode.window.showWarningMessage('⚠️ Route path is required.');
      return;
    }

    // Load configuration
    const config = vscode.workspace.getConfiguration('ci4FilesCreator');
    const routeFile = config.get<string>('routeFile') || 'app/Config/Routes.php';

    // Workspace path
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('❌ No workspace folder open.');
      return;
    }

    const basePath = workspaceFolders[0].uri.fsPath;
    const routeFilePath = path.join(basePath, routeFile);

    if (!fs.existsSync(routeFilePath)) {
      vscode.window.showErrorMessage(`❌ Route file not found: ${routeFilePath}`);
      return;
    }

    // Split group and method
    const parts = routeInput.split('/');
    const groupName = parts.length > 1 ? parts[0] : '';
    const routeName = parts.length > 1 ? parts[1] : parts[0];
    const controller = groupName
      ? `${capitalize(groupName)}::${routeName}`
      : `${capitalize(routeName)}::index`;

    const routeLine = `    $routes->${method}('${routeName}', '${controller}');`;

    // Read file
    let content = fs.readFileSync(routeFilePath, 'utf8');

    // Check for existing group or append new one
    if (groupName) {
      const groupPattern = new RegExp(
        `\\$routes->group\\(['"\`]${groupName}['"\`],[\\s\\S]*?\\}\\);`,
        'm'
      );

      if (groupPattern.test(content)) {
        // Group exists
        content = content.replace(groupPattern, (match) => {
          if (match.includes(routeLine)) return match; // skip duplicate
          return match.replace(/\}\);$/, `${routeLine}\n});`);
        });
      } else {
        // Create new group
        const newGroup = `\n$routes->group('${groupName}', function($routes) {\n${routeLine}\n});\n`;
        content += newGroup;
      }
    } else {
      // Single route (no group)
      const standaloneRoute = `\n$routes->${method}('${routeName}', '${controller}');\n`;
      if (!content.includes(standaloneRoute)) content += standaloneRoute;
    }

    // Write file
    fs.writeFileSync(routeFilePath, content, 'utf8');

    // Show message
    vscode.window.showInformationMessage(
      `✅ Added ${method.toUpperCase()} route: ${routeInput}`
    );

    // Open route file
    const doc = await vscode.workspace.openTextDocument(routeFilePath);
    await vscode.window.showTextDocument(doc);
  } catch (error: any) {
    vscode.window.showErrorMessage(`❌ Error creating route: ${error.message}`);
    console.error(error);
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
