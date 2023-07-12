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

async function readyConsole(stdin, stdout) {

  // We must remove the old command (since that's still intractable, we replace it below with a static copy)
  shellContainer.removeChild(document.getElementById("currentCommand"))
  
  // Migrate the old typed command to a static element above
  const previousLine = document.createElement("div");
  previousLine.innerHTML = `<span class="green">you@joeymanani.com</span>:<span class="blue">~</span>$ <span id="previous-shell-command" style="white-space: pre; word-wrap: break-word;">${stdin}</span>`;
  shellContainer.appendChild(previousLine);
  
  // Add the commandOutput to the console's "stdout"
  const commandOutput = document.createElement("div");
  commandOutput.style.whiteSpace = "pre";
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
  } else if (key === "ArrowUp") {
    e.preventDefault(); // Prevent default browser behavior
    n -= 1;
    nthElem = getNthCmd(n);
    n = nthElem[0]
    shellCmd.innerHTML = nthElem[1];
  } else if (key === "ArrowDown") {
    e.preventDefault(); // Prevent default browser behavior
    n += 1;
    nthElem = getNthCmd(n);
    n = nthElem[0]
    shellCmd.innerHTML = nthElem[1];
  } else if (e.ctrlKey && e.key === "c") {
    e.preventDefault(); // Prevent default browser behavior
    writeInput("^C");
    readyConsole("^C", "");
  } else if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
    writeInput(key);
  }
});

