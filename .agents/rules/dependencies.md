# Dependency Management Rule

When adding a new dependency to a project (such as a new React library, UI component, or tool):
1. **Always automatically install the dependency** by modifying `package.json` or by using the `run_command` tool to run the appropriate `npm install` / `yarn add` command.
2. **Never leave comments telling the user to install dependencies themselves** (e.g., `// Install: npm install @xyflow/react`). It is your responsibility to handle the setup and ensure the codebase remains completely working and free of module-not-found errors out-of-the-box.
3. Be mindful of correct package names. For instance, the React Flow package is `@xyflow/react`, not `xyflow` or `reactflow`. Double-check package names before installation.
