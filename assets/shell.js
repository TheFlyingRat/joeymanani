let shellCmd = document.getElementById("typed-shell-command");
let shellContainer = document.getElementById("shell");

let n = 0;
let commandHistory = [""]; // The latest command history is always blank string (pressing down arrow on linux)

// migrate to functions.js
const scrollToBottom = () => {
  document.body.scrollTop = document.body.scrollHeight;
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
};





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
      stdout = window[command](args);
    } else {
      stdout = "Unknown command: " + command;
    }
  }

  readyConsole(stdin, stdout);
}

// Example command functions
function command1(args) {
  // Handle command1 with args
  return "Command 1 executed with args: " + args.join(", ");
}

function command2(args) {
  // Handle command2 with args
  return "Command 2 executed with args: " + args.join(", ");
}



function removeLastCharacter() {
  const input = shellCmd.textContent;
  shellCmd.textContent = input.slice(0, -1);
}

function writeInput(key) {
  shellCmd.textContent += key;
}

async function readyConsole(stdin, stdout) {

  // We must remove the old command (since that's still intractable, we replace it below with a static copy)
  shellContainer.removeChild(document.getElementById("currentCommand"))
  
  // Migrate the old typed command to a static element above
  const previousLine = document.createElement("div");
  previousLine.innerHTML = `<span class="green">you@joeymanani.com</span>:<span class="blue">~</span>$ <span id="previous-shell-command" style="white-space: pre; word-wrap: break-word;">${stdin}</span>`;
  shellContainer.appendChild(previousLine);
  
  // Add the commandOutput to the console's "stdout"
  const commandOutput = document.createElement("div");
  commandOutput.innerHTML = `${stdout}`;
  shellContainer.appendChild(commandOutput);
  
  // Create a new element for user to type in
  const commandLine = document.createElement("div");
  commandLine.id = "currentCommand"
  commandLine.innerHTML = `<span class="green">you@joeymanani.com</span>:<span class="blue">~</span>$ <span id="typed-shell-command" style="white-space: pre; word-wrap: break-word;"></span>_`;
  shellContainer.appendChild(commandLine);
  
  // Since typed-shell-command element changed, redefine it
  shellCmd = document.getElementById("typed-shell-command");
  previousCmd = document.querySelectorAll("#previous-shell-command");
  scrollToBottom()
}







const getNthCmd = (n) => {
  let minIndex = -(commandHistory.length);
  let maxIndex = 1;
  let new_n = n;
  
  if (n >= maxIndex) {
    new_n -= 1;
  } else if (n <= minIndex) { 
    new_n += 1;
  } else {
    new_n = n;
  }
  console.log(new_n);
  console.log(commandHistory.at(new_n));
  return [new_n, commandHistory.at(new_n)];
};


document.addEventListener("keydown", (e) => {
  e.preventDefault(); // Prevent default browser behavior

  const key = e.key;

  // Handle different key inputs
  if (key === "Enter") {
    n = 0; // Reset n to 0
    executeCommand();
  } else if (key === "Backspace") {
    removeLastCharacter();
  } else if (key === "ArrowUp") {
    n -= 1;
    nthElem = getNthCmd(n);
    n = nthElem[0]
    shellCmd.innerHTML = nthElem[1];
  } else if (key === "ArrowDown") {
    n += 1;
    nthElem = getNthCmd(n);
    n = nthElem[0]
    shellCmd.innerHTML = nthElem[1];
  } else if (e.ctrlKey && e.key === "c") {
    writeInput("^C");
    readyConsole("^C", "");
  } else if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
    writeInput(key);
  }
});

