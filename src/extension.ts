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
	
	// import python extension
	let python = extensions.getExtension('ms-python.python');
	let pythonApi = python?.exports;
	// import renpy-languague extension
	let renpyLanguage = extensions.getExtension('luquedaniel.languague-renpy');
	let renpyLanguageApi = renpyLanguage?.exports;

	// Add a path to the Python environment
	pythonApi.setExecutionDetails('python', { path: '/path/to/renpy/library' });

}

// This method is called when your extension is deactivated
export function deactivate() {}
