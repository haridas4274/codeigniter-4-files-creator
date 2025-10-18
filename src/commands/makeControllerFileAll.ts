import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { capitalize } from "../functions";

/**
 * Command: CI4 Make Controller (All)
 * Description:
 * Creates a full CodeIgniter 4 resource-style controller with
 * predefined CRUD methods (index, create, store, show, edit, update, destroy).
 */
export async function makeControllerFileAll() {
  try {
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

    const parts = controllerInput.split("/");
    const rawControllerName = parts.pop() as string;
    const folderPath = path.join(basePath, ...parts.map(p => capitalize(p)));
    const controllerName = capitalize(rawControllerName);
    const filePath = path.join(folderPath, `${controllerName}.php`);

    const namespace =
      parts.length > 0
        ? `App\\${parts.map(p => capitalize(p)).join("\\")}\\Controllers`
        : "App\\Controllers";

    // 🧱 Resource controller content
    const content = `<?php namespace ${namespace};

use App\\Controllers\\BaseController;
use CodeIgniter\\HTTP\\ResponseInterface;

class ${controllerName} extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('${controllerInput.toLowerCase()}/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('${controllerInput.toLowerCase()}/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        // TODO: Add validation and save logic here
        return redirect()->back()->with('success', '${controllerName} created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id = null)
    {
        return view('${controllerInput.toLowerCase()}/show', ['id' => $id]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id = null)
    {
        return view('${controllerInput.toLowerCase()}/edit', ['id' => $id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id = null)
    {
        // TODO: Add update logic
        return redirect()->back()->with('success', '${controllerName} updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id = null)
    {
        // TODO: Add delete logic
        return redirect()->back()->with('success', '${controllerName} deleted successfully.');
    }
}
`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      vscode.window.showInformationMessage(`📂 Folder created: ${folderPath}`);
    }

    if (fs.existsSync(filePath)) {
      vscode.window.showWarningMessage(`⚠️ Controller "${controllerName}" already exists.`);
      return;
    }

    fs.writeFileSync(filePath, content, "utf8");

    const doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage(`✅ Resource Controller "${controllerName}" created successfully in ${folderPath}.`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`❌ Error creating resource controller: ${error.message}`);
    console.error(error);
  }
}
