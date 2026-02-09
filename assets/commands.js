// Birthday epoch for age calculation (May 21, 2006)
const BIRTHDAY_EPOCH = 1148169600000;

// Filesystem structure
const directories = {
  root: ["about", "assets", "developer", "experience", "home", "shell", "favicon.ico", "index.html", "sitemap.xml"],
  about: ["index.html"],
  developer: ["index.html"],
  experience: ["index.html"],
  home: ["index.html"],
  projects: ["index.html"],
  shell: ["index.html"],
};

// Helper: calculate age from birthday
function getAge() {
  const now = new Date();
  const born = new Date(BIRTHDAY_EPOCH);
  let years = now.getFullYear() - born.getFullYear();
  const m = now.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < born.getDate())) years--;
  return years;
}

// Helper: format uptime-style duration
function getUptime() {
  const diff = Date.now() - BIRTHDAY_EPOCH;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `up ${days} days, ${hours}:${String(mins).padStart(2, "0")}`;
}


// ── Core commands ──────────────────────────────────────────────

function help(args) {
  return `Available commands:

  help          Show this help message
  ls [dir]      List directory contents
  cat <path>    Navigate to a page
  cd <dir>      Change directory (navigate)
  pwd           Print working directory
  clear         Clear the terminal
  exit          Return to the main menu
  home          Return to the main menu

  echo <text>   Print text to stdout
  whoami        Display current user
  hostname      Display system hostname
  uname [-a]    System information
  date          Display current date
  uptime        System uptime
  history       Command history
  neofetch      System information display

  quote         Random quote from the API
  insult        Random insult from the API
  ping <host>   Ping a host
  fortune       Get your fortune
  cowsay <msg>  A cow says things
  sudo <cmd>    Execute as superuser
  rm [-rf]      Remove files`;
}

function ls(args) {
  const ls_help = `Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).

There are no OPTIONS in joeymanani linux.`;

  if (args.length === 0) {
    return directories.root.join("  ");
  }

  if (args.includes("--help")) {
    return ls_help;
  }

  if (args.length === 1) {
    const directory = args[0].replace(/\/$/, "");
    if (directory in directories) {
      return directories[directory].join("  ");
    } else {
      return `ls: cannot access '${directory}': No such file or directory`;
    }
  }

  return ls_help;
}

function cat(args) {
  const cat_help = `Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s) to standard output.

There are no OPTIONS in joeymanani linux.`;

  if (args.includes("--help")) return cat_help;
  if (args.length === 0) return cat_help;

  if (args.length === 1) {
    const target = args[0].replace(/^\//, "");
    // Check if it matches a known directory/page
    if (target in directories || target === "index.html") {
      const href = target === "index.html" ? "/" : "/" + target + "/";
      window.location.href = href;
      return "Opening...";
    }
    return `cat: ${args[0]}: No such file or directory`;
  }

  return cat_help;
}

function cd(args) {
  if (args.length === 0 || args[0] === "~" || args[0] === "/") {
    return "Already at /";
  }
  const target = args[0].replace(/^\//, "").replace(/\/$/, "");
  if (target in directories) {
    window.location.href = "/" + target + "/";
    return "Navigating...";
  }
  return `-bash: cd: ${args[0]}: No such file or directory`;
}

function pwd(args) {
  return "/home/you/joeymanani.com";
}

function clear(args) {
  // Special handling — shell.js will check for this
  const output = document.getElementById("shell");
  if (output) {
    // Remove everything except the currentCommand div
    const currentCmd = document.getElementById("currentCommand");
    while (output.firstChild) {
      if (output.firstChild === currentCmd) break;
      output.removeChild(output.firstChild);
    }
  }
  return "";
}

function exit(args) {
  window.location.href = "/home";
  return "logout";
}

// Alias
function home(args) {
  return exit(args);
}

function logout(args) {
  return exit(args);
}


// ── Info commands ──────────────────────────────────────────────

function echo(args) {
  if (args.length === 0) return "";
  return args.join(" ");
}

function whoami(args) {
  return "you";
}

function hostname(args) {
  return "joeymanani.com";
}

function uname(args) {
  if (args.includes("-a")) {
    return `Linux joeymanani 6.${getAge()}.0-joey #1 SMP ${new Date().toUTCString()} x86_64 GNU/Linux`;
  }
  return "Linux";
}

function date(args) {
  return new Date().toString();
}

function uptime(args) {
  return ` ${new Date().toTimeString().split(" ")[0]}  ${getUptime()},  1 user,  load average: 0.00, 0.01, 0.05`;
}

function history(args) {
  if (typeof commandHistory !== "undefined" && commandHistory.length > 1) {
    return commandHistory
      .slice(1) // skip the initial empty string
      .map((cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`)
      .join("\n");
  }
  return "  No commands in history.";
}

function id(args) {
  return "uid=1000(you) gid=1000(visitors) groups=1000(visitors),27(sudo)";
}

function who(args) {
  return `you      pts/0        ${new Date().toISOString().split("T")[0]} (${window.location.hostname})`;
}

function neofetch(args) {
  const age = getAge();
  return `        _,met\$\$\$\$\$gg.           you@joeymanani.com
     ,g\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$P.        ──────────────────
   ,g\$\$P"        """Y\$\$."       OS: JoeyOS ${age}.04 LTS x86_64
  ,\$\$P'              \`\$\$\$.      Host: joeymanani.com
 ',\$\$P       ,ggs.    \`\$\$b:     Kernel: ${age}.0.0-joey
 \`d\$\$'     ,\$P"'  .    \$\$\$      Uptime: ${getUptime()}
  \$\$P      d\$'     ,    \$\$P     Shell: bash 5.2.21
  \$\$:      \$\$.   -     ,d\$\$'    Terminal: joeymanani-web
  \$\$;      Y\$b._   _,d\$P'       CPU: Joey (1) @ ${age}GHz
  Y\$\$.     \`.\`"Y\$\$\$\$P"'         Memory: ∞ / ∞ MiB
  \`\$\$b      "-.__               Disk: ∞ / ∞ (0%)
   \`Y\$\$                         Location: /earth/australia/melbourne
    \`Y\$\$.                       Languages: JS, Python, Rust, C#, Ruby
      \`\$\$b.                     Website: theflyingrat.com
        \`Y\$\$b.
           \`"Y\$b._
               \`"""`;
}


// ── Fun / easter egg commands ─────────────────────────────────

function quote(args) {
  // Async fetch — return placeholder, then update
  fetch("https://api.theflyingrat.com/siteinfo/quotes")
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const q = data[Math.floor(Math.random() * data.length)];
        appendToShell(q);
      } else {
        appendToShell("No quotes available.");
      }
    })
    .catch(() => {
      appendToShell("Failed to fetch quote. Try again later.");
    });
  return "Fetching quote...";
}

function fortune(args) {
  return quote(args);
}

function insult(args) {
  fetch("https://api.theflyingrat.com/insult")
    .then(res => res.ok ? res.text() : Promise.reject())
    .then(text => {
      appendToShell(text.replace(/^"|"$/g, "").trim());
    })
    .catch(() => {
      appendToShell("Even the insult generator doesn't want to talk to you.");
    });
  return "Fetching insult...";
}

function ping(args) {
  if (args.length === 0) return "ping: usage error: Destination address required";
  const host = args[0];
  const ms = (Math.random() * 80 + 10).toFixed(1);
  return `PING ${host} (127.0.0.1) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=64 time=${ms} ms

--- ${host} ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = ${ms}/${ms}/${ms}/0.000 ms`;
}

function cowsay(args) {
  const msg = args.length > 0 ? args.join(" ") : "moo";
  const top = " " + "_".repeat(msg.length + 2);
  const bot = " " + "-".repeat(msg.length + 2);
  return `${top}
< ${msg} >
${bot}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
}

function sudo(args) {
  if (args.length === 0) return "usage: sudo <command>";
  const sub = args[0];
  if (sub === "rm" && args.includes("-rf") && (args.includes("/") || args.includes("/*"))) {
    return `[sudo] password for you: ********
rm: it is dangerous to operate recursively on '/'
rm: use --no-preserve-root to override this failsafe
Just kidding. Nice try though.`;
  }
  return `[sudo] password for you: ********
you is not in the sudoers file. This incident will be reported.`;
}

function rm(args) {
  if (args.includes("-rf") && (args.includes("/") || args.includes("/*") || args.includes("~"))) {
    return "Nice try. This isn't that kind of terminal.";
  }
  if (args.length === 0) return "rm: missing operand";
  return `rm: cannot remove '${args[args.length - 1]}': Permission denied`;
}

function touch(args) {
  if (args.length === 0) return "touch: missing file operand";
  return `touch: cannot touch '${args[0]}': Read-only file system`;
}

function mkdir(args) {
  if (args.length === 0) return "mkdir: missing operand";
  return `mkdir: cannot create directory '${args[0]}': Read-only file system`;
}

function mv(args) {
  if (args.length < 2) return "mv: missing operand";
  return `mv: cannot move '${args[0]}': Read-only file system`;
}

function cp(args) {
  if (args.length < 2) return "cp: missing operand";
  return `cp: cannot copy '${args[0]}': Read-only file system`;
}

function chcon(args) {
  return "chcon: " + args.join(" ") + ": Permission denied";
}

function chmod(args) {
  return "chmod: changing permissions: Operation not permitted";
}

function chown(args) {
  return "chown: changing ownership: Operation not permitted";
}

// yes command — returns a truncated version
function yes(args) {
  const word = args.length > 0 ? args.join(" ") : "y";
  return (word + "\n").repeat(50).trim() + "\n^C";
}

function factor(args) {
  if (args.length === 0) return "factor: missing operand";
  const n = parseInt(args[0]);
  if (isNaN(n) || n < 1) return `factor: '${args[0]}' is not a valid positive integer`;
  if (n === 1) return "1:";
  let num = n;
  const factors = [];
  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) { factors.push(d); num /= d; }
  }
  if (num > 1) factors.push(num);
  return `${n}: ${factors.join(" ")}`;
}

function seq(args) {
  if (args.length === 0) return "seq: missing operand";
  const end = parseInt(args[args.length - 1]);
  const start = args.length > 1 ? parseInt(args[0]) : 1;
  if (isNaN(start) || isNaN(end)) return "seq: invalid argument";
  const limit = Math.min(Math.abs(end - start) + 1, 100);
  const result = [];
  const step = start <= end ? 1 : -1;
  for (let i = start; result.length < limit; i += step) {
    result.push(i);
    if (i === end) break;
  }
  return result.join("\n");
}

function rev(args) {
  if (args.length === 0) return "";
  return args.join(" ").split("").reverse().join("");
}

// Joke: open xeyes
function xeyes(args) {
  return "Error: Can't open display :0\n(Just kidding, this is a website)";
}

function man(args) {
  if (args.length === 0) return "What manual page do you want?";
  return `No manual entry for ${args[0]}\n(Try 'help' for available commands)`;
}

function htop(args) {
  return `htop - ${new Date().toTimeString().split(" ")[0]} ${getUptime()},  1 user
Tasks:   1 total,   1 running,   0 sleeping
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id
MiB Mem :   ∞ total,   ∞ free,   0.0 used

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+  COMMAND
    1 you       20   0    1337   1337   1337 R   0.0   0.0   0:00.00  bash`;
}

function df(args) {
  return `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1       Infinity         0  Infinity   0% /
tmpfs              65536      1337     64199   2% /run`;
}

function env(args) {
  return `SHELL=/bin/bash
USER=you
HOME=/home/you
HOSTNAME=joeymanani.com
LANG=en_AU.UTF-8
TERM=joeymanani-web
PATH=/usr/local/bin:/usr/bin:/bin
WEBSITE=theflyingrat.com
LOCATION=Melbourne, Australia`;
}

function printenv(args) {
  return env(args);
}


// ── Helper: append async output to the shell ──────────────────

function appendToShell(text) {
  const shell = document.getElementById("shell");
  if (!shell) return;
  const currentCmd = document.getElementById("currentCommand");
  const output = document.createElement("div");
  output.style.whiteSpace = "pre";
  output.textContent = text;
  if (currentCmd) {
    shell.insertBefore(output, currentCmd);
  } else {
    shell.appendChild(output);
  }
  scrollToBottom();
}
