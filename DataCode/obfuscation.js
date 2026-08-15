(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Obfuscator must run unsandboxed!");
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;

    class VariableObfuscator {
        getInfo() {
            return {
                id: "variableObfuscator",
                name: "Variable Obfuscator",

                blocks: [
                    {
                        func: "obfuscate",
                        blockType: Scratch.BlockType.BUTTON,
                        text: "Обфусцировать переменные и списки"
                    }
                ]
            };
        }

        obfuscate() {
            const usedNames = new Set();
            const variables = [];

            const generateName = () => {
                const chars =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                let name;

                do {
                    let suffix = "";

                    for (let i = 0; i < 12; i++) {
                        suffix += chars.charAt(
                            Math.floor(Math.random() * chars.length)
                        );
                    }

                    name = "_0x" + suffix;
                } while (usedNames.has(name));

                usedNames.add(name);
                return name;
            };

            for (const target of runtime.targets) {
                if (!target.variables) continue;

                for (const variable of Object.values(target.variables)) {
                    if (
                        variable.type !== "" &&
                        variable.type !== "list"
                    ) {
                        continue;
                    }

                    if (variables.includes(variable)) {
                        continue;
                    }

                    variables.push(variable);
                }
            }


            for (const variable of variables) {
                variable.name = generateName();
            }


            try {
                vm.emitWorkspaceUpdate();
            } catch (e) {}

            try {
                runtime.requestBlocksUpdate();
            } catch (e) {}

            try {
                if (
                    typeof ScratchBlocks !== "undefined" &&
                    ScratchBlocks.getMainWorkspace
                ) {
                    const workspace =
                        ScratchBlocks.getMainWorkspace();

                    if (workspace) {
                        workspace.toolboxRefreshEnabled_ = true;

                        if (
                            typeof workspace.refreshToolboxSelection_ ===
                            "function"
                        ) {
                            workspace.refreshToolboxSelection_();
                        }

                        workspace.toolboxRefreshEnabled_ = false;
                    }
                }
            } catch (e) {}

            console.log(
                `[Variable Obfuscator] Обфусцировано: ${variables.length}`
            );
        }
    }

    Scratch.extensions.register(new VariableObfuscator());

})(Scratch);