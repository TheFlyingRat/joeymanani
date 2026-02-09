let shellCmd = document.getElementById("typed-shell-command");
let shellContainer = document.getElementById("shell");

let n = 0;
let commandHistory = [""]; // The latest command history is always blank string (pressing down arrow on linux)

// migrate to functions.js
const scrollToBottom = () => {
  document.body.scrollTop = document.body.scrollHeight;
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
};

// Known command names for tab completion
const knownCommands = [
  "help", "ls", "cat", "cd", "pwd", "clear", "exit", "home", "logout",
  "echo", "whoami", "hostname", "uname", "date", "uptime", "history",
  "id", "who", "neofetch", "quote", "fortune", "insult", "ping",
  "cowsay", "sudo", "rm", "touch", "mkdir", "mv", "cp", "chcon",
  "chmod", "chown", "yes", "factor", "seq", "rev", "xeyes", "man",
  "htop", "df", "env", "printenv"
];


function executeCommand() {
  const stdin = shellCmd.textContent.trim();
  commandHistory.push(stdin); // Insert command into front of history (test for performance)
  console.log("Command executed: ", stdin);

  const tokenizedCommand = stdin.split(" ");
  const command = tokenizedCommand[0];
  const args = tokenizedCommand.slice(1);

  let stdout = "";

  if (command !== "") {
    // Check if the command function exists
    if (typeof window[command] === "function") {
      // Dynamically call the command function with the args
      stdout = window[command](args); // Don't worry about the commands in this file. Capital letters don't exist in the console

    } else {
      stdout = `-bash: ${command}: command not found`
    }
  }

  readyConsole(stdin, stdout);
}


function removeLastCharacter() {
  const input = shellCmd.textContent;
  shellCmd.textContent = input.slice(0, -1);
}

function writeInput(key) {
  shellCmd.textContent += key;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildPromptLine(stdin) {
  const line = document.createElement("div");
  const prompt = document.createElement("span");
  prompt.className = "green";
  prompt.textContent = "you@joeymanani.com";
  line.appendChild(prompt);
  line.appendChild(document.createTextNode(":"));
  const tilde = document.createElement("span");
  tilde.className = "blue";
  tilde.textContent = "~";
  line.appendChild(tilde);
  line.appendChild(document.createTextNode("$ "));
  const cmd = document.createElement("span");
  cmd.id = "previous-shell-command";
  cmd.style.whiteSpace = "pre";
  cmd.style.wordWrap = "break-word";
  cmd.textContent = stdin;
  line.appendChild(cmd);
  return line;
}

function buildCommandLine() {
  const line = document.createElement("div");
  line.id = "currentCommand";
  const prompt = document.createElement("span");
  prompt.className = "green";
  prompt.textContent = "you@joeymanani.com";
  line.appendChild(prompt);
  line.appendChild(document.createTextNode(":"));
  const tilde = document.createElement("span");
  tilde.className = "blue";
  tilde.textContent = "~";
  line.appendChild(tilde);
  line.appendChild(document.createTextNode("$ "));
  const input = document.createElement("span");
  input.id = "typed-shell-command";
  input.style.whiteSpace = "pre";
  input.style.wordWrap = "break-word";
  line.appendChild(input);
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "_";
  line.appendChild(cursor);
  return line;
}

async function readyConsole(stdin, stdout) {

  // We must remove the old command (since that's still intractable, we replace it below with a static copy)
  shellContainer.removeChild(document.getElementById("currentCommand"))

  // Migrate the old typed command to a static element above — stdin is escaped to prevent XSS
  shellContainer.appendChild(buildPromptLine(stdin));

  // Add the commandOutput to the console's "stdout"
  const commandOutput = document.createElement("div");
  commandOutput.style.whiteSpace = "pre";
  commandOutput.textContent = stdout;
  shellContainer.appendChild(commandOutput);

  // Create a new element for user to type in
  shellContainer.appendChild(buildCommandLine());

  // Since typed-shell-command element changed, redefine it
  shellCmd = document.getElementById("typed-shell-command");
  previousCmd = document.querySelectorAll("#previous-shell-command");
  scrollToBottom()
}


function tabComplete() {
  const input = shellCmd.textContent;
  // Only complete the first token (command name)
  const tokens = input.split(" ");
  if (tokens.length > 1) return; // Don't complete args

  const partial = tokens[0];
  if (partial === "") return;

  const matches = knownCommands.filter(cmd => cmd.startsWith(partial));
  if (matches.length === 1) {
    shellCmd.textContent = matches[0];
  } else if (matches.length > 1) {
    // Show possible completions
    readyConsole(input, matches.join("  "));
  }
}


const getNthCmd = (n) => {
  let minIndex = -(commandHistory.length);
  let maxIndex = 1;
  let new_n = n; // Since n is a param and global, create local variable new_n for validation. I could probably fix this later, but this isn't a problem right now.

  if (n >= maxIndex) {
    new_n -= 1;
  } else if (n <= minIndex) {
    new_n += 1;
  } else {
    new_n = n;
  }
  return [new_n, commandHistory.at(new_n)];
};


document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Handle different key inputs
  if (key === "Enter") {
    e.preventDefault(); // Prevent default browser behavior
    n = 0; // Reset n to 0
    executeCommand();
  } else if (key === "Backspace") {
    e.preventDefault(); // Prevent default browser behavior
    removeLastCharacter();
  } else if (key === "Tab") {
    e.preventDefault();
    tabComplete();
  } else if (key === "ArrowUp") {
    e.preventDefault(); // Prevent default browser behavior
    n -= 1;
    nthElem = getNthCmd(n);
    n = nthElem[0]
    shellCmd.textContent = nthElem[1];
  } else if (key === "ArrowDown") {
    e.preventDefault(); // Prevent default browser behavior
    n += 1;
    nthElem = getNthCmd(n);
    n = nthElem[0]
    shellCmd.textContent = nthElem[1];
  } else if (e.ctrlKey && key === "c") {
    e.preventDefault(); // Prevent default browser behavior
    writeInput("^C");
    readyConsole("^C", "");
  } else if (e.ctrlKey && key === "l") {
    e.preventDefault();
    clear([]);
  } else if (e.ctrlKey && key === "u") {
    e.preventDefault();
    shellCmd.textContent = "";
  } else if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
    // Accept any printable character (length === 1), including shifted chars like !, @, ?
    writeInput(key);
  }
});
