// Name: Rotur.js
// Author: Mistium
// Description: Utilise rotur in your projects

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

MD5 = function (r) { function n(r, n) { var t, o, e, u, f; return e = 2147483648 & r, u = 2147483648 & n, f = (1073741823 & r) + (1073741823 & n), (t = 1073741824 & r) & (o = 1073741824 & n) ? 2147483648 ^ f ^ e ^ u : t | o ? 1073741824 & f ? 3221225472 ^ f ^ e ^ u : 1073741824 ^ f ^ e ^ u : f ^ e ^ u } function t(r, t, o, e, u, f, a) { return r = n(r, n(n(t & o | ~t & e, u), a)), n(r << f | r >>> 32 - f, t) } function o(r, t, o, e, u, f, a) { return r = n(r, n(n(t & e | o & ~e, u), a)), n(r << f | r >>> 32 - f, t) } function e(r, t, o, e, u, f, a) { return r = n(r, n(n(t ^ o ^ e, u), a)), n(r << f | r >>> 32 - f, t) } function u(r, t, o, e, u, f, a) { return r = n(r, n(n(o ^ (t | ~e), u), a)), n(r << f | r >>> 32 - f, t) } function f(r) { var n, t = "", o = ""; for (n = 0; 3 >= n; n++)t += (o = "0" + (o = r >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2); return t } var a, i, C, c, g, h, d, v, S; for (r = function (r) { r = r.replace(/\r\n/g, "\n"); for (var n = "", t = 0; t < r.length; t++) { var o = r.charCodeAt(t); 128 > o ? n += String.fromCharCode(o) : (127 < o && 2048 > o ? n += String.fromCharCode(o >> 6 | 192) : (n += String.fromCharCode(o >> 12 | 224), n += String.fromCharCode(o >> 6 & 63 | 128)), n += String.fromCharCode(63 & o | 128)) } return n }(r), a = function (r) { for (var n, t = r.length, o = 16 * (((n = t + 8) - n % 64) / 64 + 1), e = Array(o - 1), u = 0, f = 0; f < t;)u = f % 4 * 8, e[n = (f - f % 4) / 4] |= r.charCodeAt(f) << u, f++; return e[n = (f - f % 4) / 4] |= 128 << f % 4 * 8, e[o - 2] = t << 3, e[o - 1] = t >>> 29, e }(r), h = 1732584193, d = 4023233417, v = 2562383102, S = 271733878, r = 0; r < a.length; r += 16)i = h, C = d, c = v, g = S, h = t(h, d, v, S, a[r + 0], 7, 3614090360), S = t(S, h, d, v, a[r + 1], 12, 3905402710), v = t(v, S, h, d, a[r + 2], 17, 606105819), d = t(d, v, S, h, a[r + 3], 22, 3250441966), h = t(h, d, v, S, a[r + 4], 7, 4118548399), S = t(S, h, d, v, a[r + 5], 12, 1200080426), v = t(v, S, h, d, a[r + 6], 17, 2821735955), d = t(d, v, S, h, a[r + 7], 22, 4249261313), h = t(h, d, v, S, a[r + 8], 7, 1770035416), S = t(S, h, d, v, a[r + 9], 12, 2336552879), v = t(v, S, h, d, a[r + 10], 17, 4294925233), d = t(d, v, S, h, a[r + 11], 22, 2304563134), h = t(h, d, v, S, a[r + 12], 7, 1804603682), S = t(S, h, d, v, a[r + 13], 12, 4254626195), v = t(v, S, h, d, a[r + 14], 17, 2792965006), h = o(h, d = t(d, v, S, h, a[r + 15], 22, 1236535329), v, S, a[r + 1], 5, 4129170786), S = o(S, h, d, v, a[r + 6], 9, 3225465664), v = o(v, S, h, d, a[r + 11], 14, 643717713), d = o(d, v, S, h, a[r + 0], 20, 3921069994), h = o(h, d, v, S, a[r + 5], 5, 3593408605), S = o(S, h, d, v, a[r + 10], 9, 38016083), v = o(v, S, h, d, a[r + 15], 14, 3634488961), d = o(d, v, S, h, a[r + 4], 20, 3889429448), h = o(h, d, v, S, a[r + 9], 5, 568446438), S = o(S, h, d, v, a[r + 14], 9, 3275163606), v = o(v, S, h, d, a[r + 3], 14, 4107603335), d = o(d, v, S, h, a[r + 8], 20, 1163531501), h = o(h, d, v, S, a[r + 13], 5, 2850285829), S = o(S, h, d, v, a[r + 2], 9, 4243563512), v = o(v, S, h, d, a[r + 7], 14, 1735328473), h = e(h, d = o(d, v, S, h, a[r + 12], 20, 2368359562), v, S, a[r + 5], 4, 4294588738), S = e(S, h, d, v, a[r + 8], 11, 2272392833), v = e(v, S, h, d, a[r + 11], 16, 1839030562), d = e(d, v, S, h, a[r + 14], 23, 4259657740), h = e(h, d, v, S, a[r + 1], 4, 2763975236), S = e(S, h, d, v, a[r + 4], 11, 1272893353), v = e(v, S, h, d, a[r + 7], 16, 4139469664), d = e(d, v, S, h, a[r + 10], 23, 3200236656), h = e(h, d, v, S, a[r + 13], 4, 681279174), S = e(S, h, d, v, a[r + 0], 11, 3936430074), v = e(v, S, h, d, a[r + 3], 16, 3572445317), d = e(d, v, S, h, a[r + 6], 23, 76029189), h = e(h, d, v, S, a[r + 9], 4, 3654602809), S = e(S, h, d, v, a[r + 12], 11, 3873151461), v = e(v, S, h, d, a[r + 15], 16, 530742520), h = u(h, d = e(d, v, S, h, a[r + 2], 23, 3299628645), v, S, a[r + 0], 6, 4096336452), S = u(S, h, d, v, a[r + 7], 10, 1126891415), v = u(v, S, h, d, a[r + 14], 15, 2878612391), d = u(d, v, S, h, a[r + 5], 21, 4237533241), h = u(h, d, v, S, a[r + 12], 6, 1700485571), S = u(S, h, d, v, a[r + 3], 10, 2399980690), v = u(v, S, h, d, a[r + 10], 15, 4293915773), d = u(d, v, S, h, a[r + 1], 21, 2240044497), h = u(h, d, v, S, a[r + 8], 6, 1873313359), S = u(S, h, d, v, a[r + 15], 10, 4264355552), v = u(v, S, h, d, a[r + 6], 15, 2734768916), d = u(d, v, S, h, a[r + 13], 21, 1309151649), h = u(h, d, v, S, a[r + 4], 6, 4149444226), S = u(S, h, d, v, a[r + 11], 10, 3174756917), v = u(v, S, h, d, a[r + 2], 15, 718787259), d = u(d, v, S, h, a[r + 9], 21, 3951481745), h = n(h, i), d = n(d, C), v = n(v, c), S = n(S, g); return (f(h) + f(d) + f(v) + f(S)).toLowerCase() };

randomString = function (length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function wsClose() {
  this.ws.close();
}

class RoturExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.ws = null;
    this.client = {};
    this.packets = {};
    this.is_connected = false;
    this.authenticated = false;
    this.accounts = "";
    this.server = "";
    this.userToken = "";
    this.user = {};
    this.first_login = false;
    this.designation = "";
    this.username = "";
    this.my_client = {};
    this.mail = {};
    this.localKeys = {};
    this.syncedVariables = {};
    this.packetQueue = [];
    this.showDangerous = false;

    this.lastJoined = "";
    this.lastLeft = "";

    this.version = 6;
    this.outdated = false;

    this.callJson = {};

    fetch("https://raw.githubusercontent.com/Mistium/Origin-OS/main/Resources/info.json")
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error('Network response was not ok');
      })
      .then((data) => {
        this.accounts = data.name;
        this.server = data.server;
      })
      .catch((error) => {
        this.accounts = "sys.-origin";
        this.server = "wss://rotur.mistium.com";
      });

    this._initializeBadges();


    if (typeof window.scaffolding !== "object") {
      fetch("https://raw.githubusercontent.com/RoturTW/main/main/Implementations/SCRATCH/version.txt")
        .then((response) => {
          if (response.ok) return response.text();
          else throw new Error('Network response was not ok');
        })
        .then((data) => {
          this.outdated = this.version < parseInt(data);
        })
        .catch((error) => {
          console.error('Error fetching version:', error);
        });
    }
  }

  async _initializeBadges() {
    await this._getBadges();
  }

  async _getBadges() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/RoturTW/Badges/main/badges.json");
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      this.badges = data;
    } catch (error) {
      this.badges = [];
    }
  }

  // main functions

  handlePromise(message, funcmain) {
    const cmd = message?.val?.command;
    return new Promise((resolve, reject) => {
      this.ws.send(
        JSON.stringify(message),
      );

      const func = (event) => {
        const packet = JSON.parse(event.data);
        if (packet?.origin?.username === this.accounts) {
          if (cmd && packet?.val?.source_command === cmd) {
            funcmain(packet, resolve, reject);
            this.ws.removeEventListener("message", func);
          }
        }
      }
      this.ws.addEventListener("message", func);
    });
  }

  connectToServer(args) {
    if (!this.server || !this.accounts) {
      console.log("Waiting for server and accounts...");
      setTimeout(() => {
        this.connectToServer(args);
      }, 1000);
      return;
    }
    if (this.ws) { this.disconnect(); }
    this.designation = args.DESIGNATION;
    this.username = randomString(32);
    this.my_client = {
      system: args.SYSTEM,
      version: args.VERSION,
    };
    this.connectToWebsocket();
  }

  openPorts() {
    let ports = [];
    for (let key in this.packets) {
      ports.push(key);
    }
    if (ports.length === 0) return ["No Open Ports"];
    else return ports;
  }

  accountKeys() {
    let keys = [];
    for (let key of Object.keys(this.user)) {
      keys.push(key);
    }
    if (keys.length === 0) return ["No User Keys"];
    else return keys;
  }

  myFriends() {
    if (!(this.authenticated && this.is_connected)) return ["Not Authenticated"];
    let keys = [];
    for (let key of this.user["sys.friends"]) {
      keys.push(key);
    }
    if (keys.length === 0) return ["No Friends"];
    else return keys;
  }

  myRequests() {
    if (!(this.authenticated && this.is_connected)) return ["Not Authenticated"];
    let keys = [];
    for (let key of this.user["sys.requests"]) {
      keys.push(key);
    }
    if (keys.length === 0) return ["No Requests"];
    else return keys;
  }

  serverOnline() {
    if (!this.is_connected) return false;
    return this.client.users.indexOf(this.accounts) !== -1;
  }

  connectToWebsocket() {

    if (this.ws) this.disconnect();

    this.ws = new WebSocket(this.server);
    this.ws.onopen = () => {
      this.sendHandshake();

      this.ws.onmessage = (event) => {
        let packet = JSON.parse(event.data);
        if (packet.cmd == "client_ip") {
          this.client.ip = packet.val;
        } else if (packet.cmd == "statuscode" && typeof (packet.val) === "object") {
          this.client = Object.assign(this.client, packet.val);
          this.client.username = packet.val.username;
        } else if (packet.cmd == "ulist") {
          if (packet.mode == "add") {
            this.client.users.push(packet.val.username);
            this.lastJoined = packet.val;
          } else if (packet.mode == "remove") {
            this.client.users = this.client.users.filter(
              (user) => user != packet.val.username,
            );
            this.lastLeft = packet.val;
          } else if (packet.mode == "set") {
            this.client.users = [];
            for (let user of packet.val) {
              this.client.users.push(user.username);
            }
          }
        }
        if (packet.cmd == "pmsg") {
          this.packetQueue.push(packet);
          packet.origin = packet.origin.username;
          delete packet.rooms;
          delete packet.cmd;
          packet.client = packet.val.client;
          packet.source = packet.val.source;
          packet.payload = packet.val.payload;
          packet.timestamp = packet.val.timestamp;
          if (packet.val.source_command) {
            packet.source_command = packet.val.source_command;
            delete packet.val.source_command;
          }
          if (packet.origin === this.accounts) {
            switch (packet.source_command) {
              case "call":
                if (packet.val.payload === "request") {
                  this.callJson = packet.val;
                }
                break;
              case "omail_received":
                break;
              case "account_update":
                if (packet.payload.key === "sys.requests") {
                  if (packet.payload.value.length > this.friends.requests.length) {
                  } else {
                  }
                }
                if (packet.payload.key === "sys.currency") {
                }
                this.user[packet.payload.key] = packet.payload.value;
                break;
              case "sync_set":
                this.syncedVariables[packet.origin] ||= {};
                this.syncedVariables[packet.origin][packet.payload.key] = packet.payload.value;
                break;
              case "sync_delete":
                delete this.syncedVariables[packet.origin][packet.payload.key];
                break;
              case "sync_get":
                if (this.syncedVariables[packet.origin]) {
                  if (this.syncedVariables[packet.origin][packet.payload.key]) {
                    packet.val = this.syncedVariables[packet.origin][packet.payload.key];
                  } else {
                    packet.val = null;
                  }
                }
                break;
              case "omail_received":
                break;
              case "account_update":
                if (packet.payload.key === "sys.requests") {
                  if (packet.payload.value.length > this.friends.requests.length) {
                  } else {
                  }
                }
                if (packet.payload.key === "sys.currency") {
                }
            }
            this.user[packet.payload.key] = packet.payload.value;
          } else {
            console.log(packet);
            if (packet.val && packet.val.target) {
              this.packets[packet.val.target] ??= [];
              this.packets[packet.val.target].push(packet);
              delete packet.val;
            }
          }
        } else {
          if (packet.source_command === "sync_set") {
            this.syncedVariables[packet.origin] ||= {};
            this.syncedVariables[packet.origin][packet.payload.key] = packet.payload.value;
          }
          if (packet.source_command === "sync_delete") {
            delete this.syncedVariables[packet.origin][packet.payload.key];
          }
        }

        if (packet.listener === "handshake_cfg") {
          let username = this.designation + "-" + this.username;
          let msg = {
            cmd: "setid",
            val: username,
            listener: "set_username_cfg",
          };

          this.ws.send(JSON.stringify(msg));
        }
        if (packet.listener == "set_username_cfg") {
          this.client.username = this.username;
          let room = "roturTW";
          let msg = {
            cmd: "link",
            val: [room],
            listener: "link_cfg",
          };

          this.ws.send(JSON.stringify(msg));
        }
        if (packet.cmd === "roomlist") {
          this.client.room = packet.val[0];
        }
        if (packet.listener == "link_cfg" && !this.is_connected) {
          this.is_connected = true;
            (async () => {
              sysLog("RoturTW", `Trying to log in`);
              let localroturdata = await window.getSetting("roturLink");
              console.log(localroturdata)
              if (localroturdata) {
                let targetun = JSON.parse(localroturdata).username;
                let targetpass = JSON.parse(localroturdata).password;
                await roturExtension.login({ USERNAME: targetun, PASSWORD: targetpass });
              }
            })();
        }
      }
    };

    this.ws.onclose = () => {
      console.log("Disconnected!");
      this.is_connected = false;

      // Log out locally when disconnected
      if (this.authenticated) {
        this.authenticated = false;
        this.userToken = "";
        this.user = {};
        console.log("Logged out due to disconnection");
      }
    };
  }

  sendHandshake() {
    this.ws.send(
      JSON.stringify({
        cmd: "handshake",
        val: {
          language: "Javascript",
          version: {
            editorType: "Scratch",
            versionNumber: null,
          },
        },
        listener: "handshake_cfg",
      }),
    );
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  connected() {
    return this.is_connected;
  }

  loggedIn() {
    return this.authenticated && this.is_connected;
  }

  firstLogin() {
    return false;
  }

  login(args) {
    args.PASSWORD = MD5("" + args.PASSWORD);
    return this._login(args);
  }

  loginMd5(args) {
    return this._login(args);
  }

  async _login(args) {
    if (!this.is_connected) return "Not Connected";
    if (this.authenticated) return "Already Logged In";

    try {
      const response = await fetch(`https://social.rotur.dev/get_user?username=${encodeURIComponent(args.USERNAME)}&password=${encodeURIComponent(args.PASSWORD)}`);

      if (!response.ok) throw new Error(`Authentication failed: ${response.status}`);

      const packet = await response.json();

      this.userToken = packet.key;
      this.user = { ...packet };

      delete this.user.key;
      delete this.user.password;

      this.friends = {};

      // Handle if the user has no friends :P
      if (!this.user["sys.friends"]) this.user["sys.friends"] = [];
      if (!this.user["sys.requests"]) this.user["sys.requests"] = [];

      this.friends.list = this.user["sys.friends"];
      this.friends.requests = this.user["sys.requests"];

      delete this.user["sys.friends"];
      delete this.user["sys.requests"];

      this.username = this.designation + "-" + args.USERNAME + "Â§" + randomString(10);

      this.ws.send(
        JSON.stringify({
          cmd: "setid",
          val: this.username,
          listener: "set_username_cfg",
        })
      );

      this.my_client.username = this.username;
      this.authenticated = true;

      this.ws.send(
        JSON.stringify({
          cmd: "auth",
          val: this.userToken
        })
      );

      fetch("https://social.rotur.dev/claim_daily?auth=" + this.userToken).then((response) => {
        if (response.ok) {
      notify(`Logged in as ${args.USERNAME}`, "You got the daily credit!", "RoturTW", 1)
          
        } else {
          
      notify(`Logged in as ${args.USERNAME}`, "Welcome back!", "RoturTW", 1)
          throw new Error('Failed to claim daily reward');
        }
      })
      return `Logged in as ${args.USERNAME}`;

    } catch (error) {
      this.authenticated = false;
      throw new Error(`Failed to login as ${args.USERNAME}: ${error.message}`);
    }
  }

  register(args) {
    if (!this.is_connected) return "Not Connected";
    if (this.authenticated) return "Already Logged In";
    return this.handlePromise({
      cmd: "pmsg",
      val: {
        client: this.my_client,
        command: "new_account",
        id: ":3",
        ip: this.client.ip,
        payload: {
          username: args.USERNAME,
          password: MD5("" + args.PASSWORD),
        }
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val?.payload === "Account Created Successfully") {
        resolve(`Registered as ${args.USERNAME}`);
      } else {
        reject(`Failed to register as ${args.USERNAME}: ${packet.val.payload}`);
      }
    });
  }

  deleteAccount() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!confirm(`Are You Sure You Want To Delete ${this.client.username}? Everything will be lost!`)) return "Cancelled";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        client: this.my_client,
        command: "delete_account",
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val?.source_command === "delete") {
        if (packet.val.payload === "Account Deleted Successfully") {
          this.userToken = "";
          this.user = {};
          this.authenticated = false;
          this.ws.close();
          resolve("Account Deleted Successfully");
        } else {
          reject("Failed to delete account: " + packet.val.payload);
        }
      }
    });
  }

  logout() {
    if (!this.is_connected) {
      return;
    }
    this.ws.send(
      JSON.stringify({
        cmd: "pmsg",
        val: {
          command: "logout",
          client: this.my_client,
          id: ":3",
        },
        id: this.accounts,
      }),
    );
    this.authenticated = false;
    this.userToken = "";
    this.user = {};
    this.disconnect();
  }

  getToken() {
    return this.userToken ?? "";
  }

  getkey(args) {
    if (!this.is_connected) {
      return "Not Connected";
    } else if (!this.authenticated) {
      return "Not Logged In";
    }
    if (args.KEY in this.user) {
      let keyData = this.user[args.KEY];
      if (typeof keyData === "object") {
        return JSON.stringify(keyData);
      } else {
        return keyData;
      }
    } else {
      return "";
    }
  }

  setkey(args) {
    // this is server side, removing this does nothing other than make the server reject the request
    if (args.VALUE.length > 1000) return "Key Too Long, Limit is 1000 Characters";
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "update",
        client: this.my_client,
        id: ":3",
        payload: [args.KEY, args.VALUE],
      },
      id: this.accounts,
    },
      (packet, resolve) => {
        if (packet.val.payload === "Account Updated Successfully") {
          this.user[args.KEY] = args.VALUE;
        }
        resolve(packet.val.payload);
      });
  }

  keyExists(args) {
    if (!this.is_connected) return false;
    if (!this.authenticated) return false;
    return args.KEY in this.user;
  }

  getkeys() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(Object.keys(this.user));
  }

  getvalues() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(Object.values(this.user));
  }

  getAccount() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.user);
  }

  setStorageID(args) {
    if (!(this.authenticated && this.is_connected)) {
      console.error("Unable to set the storage ID: Not Logged In");
      return;
    }
    if (this.storage_id) {
      console.error("Unable to set the storage ID: Already Set");
      return;
    }
    if (window.confirm("This project would like to use the storage id: " + args.ID + ". Do you want to continue?")) {
      this.handlePromise({
        cmd: "pmsg",
        val: {
          command: "storage_getid",
          client: this.my_client,
          id: ":3",
          payload: args.ID,
        },
        id: this.accounts,
      }, (packet, resolve, reject) => {
        if (packet.val.payload !== "Not Logged In") {
          resolve("" + args.ID);
          this.storage_id = "" + args.ID;
          this.localKeys = JSON.parse(packet.val.payload);
        } else {
          console.error("Failed to set storage id: " + packet.val.payload);
          reject(packet.val.payload);
        }
      });
    }
  }

  storageIdExists() {
    return this.storage_id !== undefined;
  }

  getStorageID() {
    return this.storage_id ?? "";
  }

  getStorageKey(args) {
    if (!(this.authenticated && this.is_connected)) {
      return "Not Logged In";
    } else if (!this.storage_id) {
      return "Storage Id Not Set";
    } else {
      return this.localKeys[args.KEY] ?? "";
    }
  }

  setStorageKey(args) {
    // this is server side, removing this does nothing other than make the server reject the request
    if (args.VALUE.length > 1000) return "Key Too Long, Limit is 1000 Characters";

    if (!(this.authenticated && this.is_connected)) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";

    this.localKeys[args.KEY] = args.VALUE;
    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "storage_set",
        id: ":3",
        client: this.my_client,
        payload: {
          key: args.KEY,
          value: args.VALUE,
          id: this.storage_id,
        }
      },
      id: this.accounts
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Successfully Set Key") {
        resolve("Key Set");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  existsStorageKey(args) {
    if (!(this.authenticated && this.is_connected) || !this.storage_id) return false;
    return args.KEY in this.localKeys;
  }

  deleteStorageKey(args) {
    if (!(this.authenticated && this.is_connected)) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";

    delete this.localKeys[args.KEY];

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "storage_delete",
        id: ":3",
        client: this.my_client,
        payload: {
          key: args.KEY,
          id: this.storage_id,
        },
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Successfully Deleted Key") {
        resolve("Key Deleted");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  getStorageKeys() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";
    return JSON.stringify(Object.keys(this.localKeys));
  }

  getStorageValues() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";
    return JSON.stringify(Object.values(this.localKeys));
  }

  clearStorage() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "storage_clear",
        id: ":3",
        client: this.my_client,
        payload: this.storage_id
      },
      id: this.accounts
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Successfully Cleared Storage") {
        this.localKeys = {};
        resolve("Storage Cleared");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  storageUsage() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";

    return JSON.stringify(this.localKeys).length + "";
  }

  storageLimit() {
    return "50000";
  }

  storageRemaining() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.storage_id) return "Storage Id Not Set";

    return (50000 - JSON.stringify(this.localKeys).length) + "";
  }

  accountStorageUsage() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "storage_usage",
        client: this.my_client,
        id: ":3"
      },
      id: this.accounts
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Not Logged In") {
        reject("Not Logged In");
      } else {
        resolve(packet.val.payload);
      }
    });
  }

  accountStorageLimit() {
    return "1000000";
  }

  accountStorageRemaining() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "storage_usage",
        client: this.my_client,
        id: ":3"
      },
      id: this.accounts
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Not Logged In") {
        reject("Not Logged In");
      } else {
        resolve(1000000 - Number(packet.val.payload));
      }
    });
  }

  sendMessage(args) {
    if (!this.is_connected) {
      console.error("Unable to send message: Not Connected");
      return "";
    }
    this.ws.send(
      JSON.stringify({
        cmd: "pmsg",
        val: {
          client: this.my_client,
          payload: args.PAYLOAD,
          source: args.SOURCE,
          target: args.TARGET,
          timestamp: Date.now(),
        },
        id: args.USER,
      }),
    );
  }

  whenMessageReceived() {
    return true;
  }

  getPacketsFromTarget(args) {
    return JSON.stringify(this.packets[args.TARGET] || "[]");
  }

  numberOfPacketsOnTarget(args) {
    return this.packets[args.TARGET] ? this.packets[args.TARGET].length : 0;
  }

  getFirstPacketOnTarget(args) {
    return JSON.stringify(this.packets[args.TARGET]?.[0] || "{}");
  }

  dataOfFirstPacketOnTarget(args) {
    switch (args.DATA) {
      case "origin":
        return this.packets[args.TARGET]?.[0]?.origin || "";
      case "client":
        return (
          JSON.stringify(this.packets[args.TARGET]?.[0]?.client) ||
          '{"system":"Unknown", "version":"Unknown"}'
        );
      case "source port":
        return this.packets[args.TARGET]?.[0]?.source || "Unknown";
      case "payload":
        return this.packets[args.TARGET]?.[0]?.payload || "";
      case "timestamp":
        return this.packets[args.TARGET]?.[0]?.timestamp || "0";
      default:
        return "";
    }
  }

  getAllTargets() {
    return JSON.stringify(Object.keys(this.packets));
  }

  getAllPackets() {
    return JSON.stringify(this.packets);
  }

  deleteFirstPacketOnTarget(args) {
    if (this.packets[args.TARGET]) {
      let packet = this.packets[args.TARGET]?.[0];
      this.packets[args.TARGET].shift();
      return JSON.stringify(packet);
    }
    return "{}";
  }

  deletePacketsOnTarget(args) {
    delete this.packets[args.TARGET];
  }

  deleteAllPackets() {
    this.packets = {};
  }

  clientIP() {
    if (!this.is_connected) return "Not Connected";
    return this.client.ip;
  }

  clientUsername() {
    if (!this.is_connected) return "Not Connected";
    return this.client.username;
  }

  getClient() {
    if (!this.is_connected) return "Not Connected";
    return JSON.stringify(this.client);
  }

  clientUsers() {
    if (!this.is_connected) return "Not Connected";
    return JSON.stringify(this.client.users);
  }

  getUserDesignation(args) {
    if (!this.is_connected) return "Not Connected";
    return JSON.stringify(
      this.client.users.filter((user) =>
        user.startsWith(args.DESIGNATION + "-"),
      ),
    );
  }

  usernameConnected(args) {
    if (!this.is_connected) return false;
    if (!this.authenticated) return false;
    let regexp = new RegExp('(?<=")[a-zA-Z]{3}-' + args.USER + 'Â§\\S{10}(?=")', "gi");
    return JSON.stringify(this.client.users).match(regexp) !== null;
  }

  userConnected(args) {
    if (!this.is_connected) return "Not Connected";
    if (args.DESIGNATION.length !== 3) return "Invalid Designation";
    let regexp = new RegExp('(?<=")' + args.DESIGNATION + '-' + args.USER + 'Â§\\S{10}(?=")', "gi");
    return JSON.stringify(this.client.users).match(regexp) !== null;
  }

  findID(args) {
    if (!this.is_connected) return "Not Connected";
    let regexp = new RegExp('[a-zA-Z]{3}-' + args.USER + 'Â§\\S{10}', "gi");
    return JSON.stringify(
      this.client.users.filter((user) => user.match(regexp) !== null),
    );
  }

  RAWgetAllPackets() {
    return JSON.stringify(this.packetQueue);
  }

  RAWgetFirstPacket() {
    return JSON.stringify(this.packetQueue[0] || {});
  }

  RAWdeleteFirstPacket() {
    this.packetQueue.shift();
  }

  RAWdeleteAllPackets() {
    this.packetQueue = [];
  }

  onJoinUser() {
    return this.lastJoined;
  }

  onLeaveUser() {
    return this.lastLeft;
  }

  setSyncedVariable(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    this.ws.send(
      JSON.stringify({
        cmd: "pmsg",
        val: {
          client: this.my_client,
          source_command: "sync_set",
          payload: {
            key: args.KEY,
            value: args.VALUE,
          },
        },
        id: args.USER,
      }),
    )
    this.syncedVariables[args.USER] ||= {};
    this.syncedVariables[args.USER][args.KEY] = args.VALUE;
  }

  getSyncedVariable(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.syncedVariables[args.USER][args.KEY] || "");
  }

  deleteSyncedVariable(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    this.ws.send(
      JSON.stringify({
        cmd: "pmsg",
        val: {
          source_command: "sync_delete",
          client: this.my_client,
          payload: {
            key: args.KEY,
          },
        },
        id: args.USER,
      }),
    )
    delete this.syncedVariables[args.USER][args.KEY];
  }

  getSyncedVariables(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.syncedVariables[args.USER] || {});
  }

  sendMail(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "omail_send",
        client: this.my_client,
        id: ":3",
        payload: {
          title: args.SUBJECT,
          body: args.MESSAGE,
          recipient: args.TO,
        },
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Successfully Sent Omail") {
        resolve(`Mail sent to ${args.TO}`);
      } else {
        reject(`Failed to send mail to ${args.TO}: ${packet.val.payload}`);
      }
    });
  }

  getAllMail() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "omail_getinfo",
        client: this.my_client,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve) => {
      resolve(JSON.stringify(packet.val.payload));
    });
  }

  getMail(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "omail_getid",
        client: this.my_client,
        payload: args.ID,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val?.payload[0] === args.ID) {
        resolve(JSON.stringify(packet.val.payload[1]));
      } else {
        reject(`Failed to get mail with ID: ${args.ID}`);
      }
    });
  }

  deleteMail(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "omail_delete",
        client: this.my_client,
        payload: args.ID,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Deleted Successfully") {
        resolve(`Mail with ID ${args.ID} deleted`);
      } else {
        reject(`Failed to delete mail with ID ${args.ID}: ${packet.val.payload}`);
      }
    });
  }

  deleteAllMail() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "omail_delete",
        client: this.my_client,
        payload: "all",
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Deleted Successfully") {
        resolve("All mail deleted");
      } else {
        reject(`Failed to delete all mail: ${packet.val.payload}`);
      }
    });
  }

  getFriendList() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.friends.list);
  }

  sendFriendRequest(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (this.friends.list.includes(args.FRIEND)) return "Already Friends";
    if (args.FRIEND === this.user.username) return "You Need Other Friends :/";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "friend_request",
        client: this.my_client,
        payload: args.FRIEND,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Sent Successfully") {
        resolve("Sent Successfully");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  removeFriend(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.friends.list.includes(args.FRIEND)) return "Not Friends";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "friend_remove",
        client: this.my_client,
        payload: args.FRIEND,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Friend Removed") {
        this.friends.list = this.friends.list.filter(friend => friend !== args.FRIEND);
        resolve(`Friend removed: ${args.FRIEND}`);
      } else {
        reject(`Failed to remove friend: ${packet.val.payload}`);
      }
    });
  }

  acceptFriendRequest(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.friends.requests.includes(args.FRIEND)) return "No Request";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "friend_accept",
        client: this.my_client,
        payload: args.FRIEND,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Request Accepted") {
        this.friends.list.push(args.FRIEND);
        this.friends.requests = this.friends.requests.filter(
          (user) => user != args.FRIEND,
        );
        resolve("Request Accepted");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  declineFriendRequest(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.friends.requests.includes(args.FRIEND)) return "No Request";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "friend_decline",
        client: this.my_client,
        payload: args.FRIEND,
        id: ":3",
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Request Declined") {
        this.friends.requests = this.friends.requests.filter(
          (user) => user != args.FRIEND,
        );
        resolve("Request Declined");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  getFriendStatus(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (this.friends.list.includes(args.FRIEND)) {
      return "Friend";
    } else if (this.friends.requests.includes(args.FRIEND)) {
      return "Requested";
    } else {
      return "Not Friend";
    }
  }

  getFriendRequests() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.friends.requests) ?? "";
  }

  getFriendCount() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return this.friends.list.length ?? "";
  }

  getBalance() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return this.user["sys.currency"] ?? 0;
  }

  transferCurrency(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return this.handlePromise({
      cmd: "pmsg",
      val: {
        command: "currency_transfer",
        client: this.my_client,
        payload: {
          amount: args.AMOUNT,
          recipient: args.USER,
        },
        id: ":3",
        client: this.my_client,
      },
      id: this.accounts,
    }, (packet, resolve, reject) => {
      if (packet.val.payload === "Transfer Successful") {
        resolve("Success");
      } else {
        reject(packet.val.payload);
      }
    });
  }

  getTransactions() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.user["sys.transactions"]);
  }

  getTransactionCount() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return this.user["sys.transactions"].length;
  }

  getMyOwnedItems() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return fetch(`https://social.rotur.dev/keys/mine?auth=${this.userToken}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        return JSON.stringify(data);
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  ownsItem(args) {
    if (!this.is_connected) return false;
    if (!this.authenticated) return false;

    const username = this.user.username;

    return fetch(`https://social.rotur.dev/keys/check/${username}?key=${args.ITEM}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        return data.owns === true;
      })
      .catch(error => {
        console.error(`Error checking key ownership: ${error.message}`);
        return false;
      });
  }

  itemData(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return fetch(`https://social.rotur.dev/keys/get/${args.ITEM}?auth=${this.userToken}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        return data.data || "No data available";
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  purchaseItem(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return fetch(`https://social.rotur.dev/keys/purchase/${args.ITEM}?auth=${this.userToken}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          return "Item Purchased";
        } else {
          return data.message || "Purchase failed";
        }
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  itemInfo(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return fetch(`https://social.rotur.dev/keys/get/${args.ITEM}?auth=${this.userToken}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        return JSON.stringify(data);
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  getPublicItems(args) {
    return "[]";
  }

  getPublicItemPages() {
    return "[]";
  }

  getMyCreatedItems() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return fetch(`https://social.rotur.dev/keys/mine?auth=${this.userToken}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        const createdItems = data.filter(item => item.isCreator === true);
        return JSON.stringify(createdItems);
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  createItem(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    const url = `https://social.rotur.dev/keys/create?auth=${this.userToken}&data=${encodeURIComponent(args.CODE)}&price=${encodeURIComponent(args.PRICE)}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          return "Item Created";
        } else {
          return data.message || "Creation failed";
        }
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  updateItem(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    let updateUrl = `https://social.rotur.dev/keys/update/${args.ITEM}?auth=${this.userToken}&key=${args.ITEM}`;

    if (args.KEY === "data") {
      updateUrl += `&data=${encodeURIComponent(args.DATA)}`;
    } else {
      return "Only data updates are supported through the API. Use the key manager for other properties.";
    }

    return fetch(updateUrl)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          return "Item Updated";
        } else {
          return data.message || "Update failed";
        }
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  deleteItem(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return fetch(`https://social.rotur.dev/keys/delete/${args.ITEM}?auth=${this.userToken}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          return "Item Deleted";
        } else {
          return data.message || "Deletion failed";
        }
      })
      .catch(error => {
        return `Error: ${error.message}`;
      });
  }

  hideItem(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return "Please use the key manager at https://rotur.dev/key-manager to hide keys";
  }

  showItem(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";

    return "Please use the key manager at https://rotur.dev/key-manager to show keys";
  }

  RAWgetAllPackets() {
    return JSON.stringify(this.packetQueue);
  }

  RAWgetFirstPacket() {
    return JSON.stringify(this.packetQueue[0] || "{}");
  }

  RAWdeleteFirstPacket() {
    this.packetQueue.shift();
  }

  RAWdeleteAllPackets() {
    this.packetQueue = [];
  }

  gotBadgesSuccessfully() {
    return JSON.stringify(this.badges) !== "[]";
  }

  userBadges() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.user["sys.badges"]);
  }

  userBadgeCount() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return this.user["sys.badges"].length;
  }

  hasBadge(args) {
    if (!this.is_connected) return false;
    if (!this.authenticated) return false;
    return this.user["sys.badges"].includes(args.BADGE);
  }

  allBadges() {
    console.log(this.badges);
    return JSON.stringify(Object.keys(this.badges));
  }

  badgeInfo(args) {
    return JSON.stringify(this.badges?.[args.BADGE] ?? {});
  }

  redownloadBadges() {
    this._initializeBadges()
  }

  callUser(args) {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (args.USERNAME === this.user.username) return "You Can't Call Yourself";

    return new Promise((resolve, reject) => {
      // Send the call request
      this.ws.send(
        JSON.stringify({
          cmd: "pmsg",
          val: {
            command: "call",
            client: this.my_client,
            id: ":3",
            payload: "request",
            peer: args.USERNAME,
            username: this.username,
          },
          id: this.accounts,
        })
      );

      // Set up timeout for 10 seconds
      const timeout = setTimeout(() => {
        this.ws.removeEventListener("message", callResponseHandler);
        resolve(JSON.stringify({
          success: false,
          message: "Call timed out - no response received"
        }));
      }, 10000);

      // Handler for the call confirmation response
      const callResponseHandler = (event) => {
        try {
          const packet = JSON.parse(event.data);

          // Check if this is a call confirmation response
          if (packet?.val?.source_command === "call" &&
            packet?.val?.payload === "confirm" &&
            packet?.origin?.username === this.accounts) {

            // Clear the timeout and remove the event listener
            clearTimeout(timeout);
            this.ws.removeEventListener("message", callResponseHandler);

            // Extract and return the call data
            const callData = {
              success: true,
              from: packet.val.from,
              from_username: packet.val.from_username,
              from_rotur: packet.val.from_rotur,
            };

            // Store the call data and resolve with it
            this.callJson = callData;
            resolve(JSON.stringify(callData));
          }
        } catch (error) {
          console.error("Error handling call response:", error);
        }
      };

      // Add the event listener for call responses
      this.ws.addEventListener("message", callResponseHandler);
    });
  }

  callData() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    return JSON.stringify(this.callJson);
  }

  acceptCall() {
    if (!this.is_connected) return "Not Connected";
    if (!this.authenticated) return "Not Logged In";
    if (!this.callJson) return "No Call Data";

    this.ws.send(
      JSON.stringify({
        cmd: "pmsg",
        val: {
          command: "call",
          client: this.my_client,
          id: ":3",
          payload: "confirm",
          peer: this.callJson.from,
          username: this.username,
        },
        id: this.accounts,
      })
    );
  }
}

var roturExtension = null;
onstartup.push(async () => {
  let localroturdata = await window.getSetting("roturLink");
  if (localroturdata) {
    roturExtension = new RoturExtension();
    await setuprotur();
  }
});