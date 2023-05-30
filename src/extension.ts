// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { extensions } from 'vscode';

// https://code.visualstudio.com/api/references/contribution-points
// https://code.visualstudio.com/api/extension-guides/debugger-extension

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log("Ren'Py VSCode extension activated!");

	let settings = vscode.workspace.getConfiguration('renpy-vscode');
	let renpySDKPath: string | undefined = settings.get("renpy.renpySDKPath");
	
	// import python extension
	let python = extensions.getExtension('ms-python.python');
	if (!python)
	{
		vscode.window.showErrorMessage("The 'ms-python.python' extension is required");
	}
	else
	{
		let pythonApi = python?.exports;
		if (!renpySDKPath)
		{
			vscode.window.showErrorMessage("The setting 'renpy.renpySDKPath' has not been set");
		}
		else
		{
			// Add a path to the Python environment
			pythonApi.setExecutionDetails('python', { path: renpySDKPath });
		}
	}

	// import renpy-languague extension
	let renpyLanguage = extensions.getExtension('luquedaniel.languague-renpy');
	let renpyLanguageApi = renpyLanguage?.exports;
}

// This method is called when your extension is deactivated
export function deactivate() {}
