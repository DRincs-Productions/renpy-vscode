import * as vscode from 'vscode';
import { Disposable } from '../utils/dispose';

// https://code.visualstudio.com/api/extension-guides/task-provider

class RenpyTaskDefinition implements vscode.TaskDefinition {
	constructor(public task: string) {
		this.task = task;
	}
	[name: string]: any;
	type: string = 'renpy'
}

/**
 * Provides tasks for building `tsconfig.json` files in a project.
 */
class RenpyTaskProvider extends Disposable implements vscode.TaskProvider {
	public constructor() {
		super();
		this._register(vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this));
		this.onConfigurationChanged();
	}

	public async provideTasks(token: vscode.CancellationToken): Promise<vscode.Task[]> {
		return Promise.resolve([
			new vscode.Task(
				new RenpyTaskDefinition('run'),
				vscode.TaskScope.Workspace,
				'Run',
				'renpy',
			),
			new vscode.Task(
				new RenpyTaskDefinition('compile'),
				vscode.TaskScope.Workspace,
				'Re-Compile',
				'renpy',
			),
			new vscode.Task(
				new RenpyTaskDefinition('rmpersistent'),
				vscode.TaskScope.Workspace,
				'Delete Persistent',
				'renpy',
			),
			new vscode.Task(
				new RenpyTaskDefinition('lint'),
				vscode.TaskScope.Workspace,
				'Lint',
				'renpy',
			),
			new vscode.Task(
				new RenpyTaskDefinition('distribute'),
				vscode.TaskScope.Workspace,
				'Distribute',
				'renpy',
			),
		]);
	}

	public async resolveTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
		if (!process.env.hasOwnProperty('RenPy')) {
			vscode.window.showErrorMessage("Ren'Py SDK not found. Please set the environment variable RenPy to the path of your Ren'Py SDK.");
			return undefined;
		}

		let renpy = process.env['RenPy'];
		if (renpy === undefined) {
			vscode.window.showErrorMessage("Ren'Py SDK not found. Please set the environment variable RenPy to the path of your Ren'Py SDK.");
			return undefined;
		}

		let executable = undefined;
		if (process.platform === 'win32') {
			executable = renpy + '\\renpy.exe';
		} else if (process.platform === 'linux') {
			executable = renpy + '/renpy.sh';
		} else if (process.platform === 'darwin') {
			executable = renpy + '/renpy.sh';
		} else {
			vscode.window.showErrorMessage("Platform not supported.")
			return undefined;
		}

		const task = _task.definition.task;
		// A Renpy task consists of a task and an optional file as specified in RenpyTaskDefinition
		// Make sure that this looks like a Renpy task by checking that there is a task.
		if (task) {
			// resolveTask requires that the same definition object be used.
			const definition: RenpyTaskDefinition = <any>_task.definition;
			return new vscode.Task(
				definition,
				_task.scope ?? vscode.TaskScope.Workspace,
				definition.task,
				definition.type,
				new vscode.ProcessExecution(executable, [definition.task]), // new ShellExecution
			);
		}
		return undefined;
	}

	private onConfigurationChanged(): void {
		// const type = vscode.workspace.getConfiguration('typescript.tsc').get<AutoDetect>('autoDetect');
		// this.autoDetect = typeof type === 'undefined' ? AutoDetect.on : type;
	}
}

export function registerTaskProvider() {
	return vscode.tasks.registerTaskProvider('renpy', new RenpyTaskProvider());
}
