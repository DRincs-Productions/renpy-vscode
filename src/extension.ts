// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { extensions } from 'vscode';
import { registerTaskProvider } from './task/taskProvider';

// https://code.visualstudio.com/api/references/contribution-points
// https://code.visualstudio.com/api/extension-guides/debugger-extension

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log("Ren'Py VSCode extension activated!");

	// register task provider
	context.subscriptions.push(registerTaskProvider());

	// let settings = vscode.workspace.getConfiguration('renpy');
	// let sdkPath: string | undefined = settings.get("sdkPath");

	// // Add a path to the Python environment
	// if (sdkPath) {
	// 	context.environmentVariableCollection.append("renpy", sdkPath)
	// 	addAPathToThePythonEnvironment(sdkPath);
	// }
	// else {
	// 	context.environmentVariableCollection.clear()
	// 	vscode.window.showErrorMessage("The setting 'renpy.sdkPath' has not been set");
	// }

	// check if renpy language extension is installed
	let renpyLanguage = extensions.getExtension('luquedaniel.languague-renpy');
	if (!renpyLanguage) {
		vscode.window.showInformationMessage("The 'luquedaniel.languague-renpy' extension is recommended for syntax highlighting");
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }

/**
 * Add a path to the Python environment
 * @param sdkPath 
 * @returns 
 */
function addAPathToThePythonEnvironment(sdkPath: string) {
	const pythonExtension = extensions.getExtension('ms-python.python');
	if (pythonExtension) {
		if (!pythonExtension.isActive) {
			pythonExtension.activate().then(() => {
				const pythonApi: any = pythonExtension.exports //as IExtensionAPI;
				// Add a path to the Python environment
				pythonApi.environments.updateActiveEnvironmentPath("renpy");
				pythonApi.environments.refreshEnvironments().then(() => {
					const environments = pythonApi.environments.known;
				})
			});
		}
		else {
			const pythonApi: any = pythonExtension.exports //as IExtensionAPI;
			// Add a path to the Python environment
			pythonApi.environments.updateActiveEnvironmentPath("renpy");
			pythonApi.environments.refreshEnvironments().then(() => {
				const environments = pythonApi.environments.known;
			})
		}
	}
	else {
		// TODO: check add ignore setting
		vscode.window.showWarningMessage("The 'ms-python.python' extension is recommended for python files (you can ignore this message in the settings)");
	}
}
