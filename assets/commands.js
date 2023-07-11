const commands = [
    "basename", "cat", "chgrp", "chmod", "chown", "chroot", "cksum", "comm", "cp",
    "csplit", "cut", "date", "dd", "df", "dir", "dircolors", "dirname", "du", "echo",
    "env", "expand", "expr", "factor", "false", "fmt", "fold", "groups", "head", "id",
    "install", "join", "kill", "link", "ln", "logname", "ls", "md5sum", "mkdir", "mkfifo",
    "mknod", "mv", "nice", "nl", "nohup", "nproc", "od", "paste", "pathchk", "pinky", "pr",
    "printenv", "printf", "pwd", "readlink", "realpath", "rm", "rmdir", "runcon", "seq",
    "shred", "sleep", "sort", "split", "stat", "stty", "sum", "sync", "tail", "tee", "test",
    "timeout", "touch", "tr", "true", "truncate", "tsort", "tty", "uname", "unlink",
    "uptime", "wc", "who", "whoami", "yes"
  ];



function ls(args) {
    const directories = {
      root: ["about", "assets", "developer", "experience", "home", "projects", "favicon.ico", "index.html", "sitemap.xml"],
      about: ["index.html"],
      developer: ["index.html"],
      experience: ["index.html"],
      home: ["index.html"],
      projects: ["index.html"],
      // Add more directories and their contents here
    };
  
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
      const directory = args[0];
  
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

    if (args.includes("--help")) {
        return cat_help;
    }

    if (args.length === 0) {
        return cat_help;
    }

    if (args.length === 1) {
        const fileOrDirectory = args[0];
        const request = new XMLHttpRequest();
        let rCode = 1;

        request.open("GET", fileOrDirectory, false); // Make the request synchronous

        request.onload = function () {
            if (request.status === 200) {
                // If the request is successful, redirect the user to the page
                window.location.href = fileOrDirectory;
                rCode = 0;
            } else {
                // If the request fails, return the error message
                rCode = 1;
            }
        };

        request.onerror = function () {
            // Handle any network or request-related errors
            rCode = 1;
        };

        request.send();

        if (rCode === 0) {
            // Success code 
            return "Opening...";
        } else {
            return `cat: ${fileOrDirectory}: No such file or directory`;
        }
    }

    return cat_help;
}

function chcon(args) {
    // Handle chcon
    return "chcon: " + args.join(" ") + ": Permission denied";
}



  
function command2(args) {
    // Handle command2 with args
    return "Command 2 executed with args: " + args.join(", ");
}
