// Name: Quaternions
// Description: Quaternion operations for 3D rotations. Built on complex numbers foundation.
// By: Assistant
// License: MIT

((Scratch) => {
  "use strict";

  const { ArgumentType, BlockType } = Scratch;

  // --- КЛАСС КВАТЕРНИОНА ---
  class Quaternion {
    constructor(w, x, y, z) {
      this.w = w || 0;
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }

    toString() {
      const parts = [];
      if (this.w !== 0) parts.push(this.w);
      if (this.x !== 0) parts.push((this.x >= 0 ? "+" : "") + this.x + "i");
      if (this.y !== 0) parts.push((this.y >= 0 ? "+" : "") + this.y + "j");
      if (this.z !== 0) parts.push((this.z >= 0 ? "+" : "") + this.z + "k");
      
      if (parts.length === 0) return "0";
      return parts.join("").replace(/^\+/, "");
    }

    magnitude() {
      return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
    }

    conjugate() {
      return new Quaternion(this.w, -this.x, -this.y, -this.z);
    }

    inverse() {
      const magSq = this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
      if (magSq === 0) return new Quaternion(0, 0, 0, 0);
      return new Quaternion(
        this.w / magSq,
        -this.x / magSq,
        -this.y / magSq,
        -this.z / magSq
      );
    }

    normalize() {
      const mag = this.magnitude();
      if (mag === 0) return new Quaternion(1, 0, 0, 0); // identity quaternion
      return new Quaternion(
        this.w / mag,
        this.x / mag,
        this.y / mag,
        this.z / mag
      );
    }

    add(other) {
      return new Quaternion(
        this.w + other.w,
        this.x + other.x,
        this.y + other.y,
        this.z + other.z
      );
    }

    subtract(other) {
      return new Quaternion(
        this.w - other.w,
        this.x - other.x,
        this.y - other.y,
        this.z - other.z
      );
    }

    multiply(other) {
      // Non-commutative multiplication
      const w = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z;
      const x = this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y;
      const y = this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x;
      const z = this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w;
      
      return new Quaternion(w, x, y, z);
    }

    scale(scalar) {
      return new Quaternion(
        this.w * scalar,
        this.x * scalar,
        this.y * scalar,
        this.z * scalar
      );
    }

    dot(other) {
      return this.w * other.w + this.x * other.x + this.y * other.y + this.z * other.z;
    }

    // Convert to axis-angle representation
    toAxisAngle() {
      const angle = 2 * Math.acos(this.w);
      const s = Math.sqrt(1 - this.w * this.w);
      
      if (s < 0.001) {
        // If s is zero, return arbitrary axis
        return { axis: [1, 0, 0], angle: angle };
      }
      
      return {
        axis: [this.x / s, this.y / s, this.z / s],
        angle: angle
      };
    }

    // Rotate a 3D vector by this quaternion
    rotateVector(vx, vy, vz) {
      const q = this.normalize();
      const p = new Quaternion(0, vx, vy, vz);
      const result = q.multiply(p).multiply(q.conjugate());
      
      return [result.x, result.y, result.z];
    }

    // Spherical linear interpolation
    slerp(other, t) {
      const cosHalfTheta = this.dot(other);
      
      // If quaternions are very close, use linear interpolation
      if (Math.abs(cosHalfTheta) >= 1.0) {
        return this;
      }
      
      const halfTheta = Math.acos(cosHalfTheta);
      const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
      
      // Avoid division by zero
      if (Math.abs(sinHalfTheta) < 0.001) {
        return new Quaternion(
          (this.w * 0.5 + other.w * 0.5),
          (this.x * 0.5 + other.x * 0.5),
          (this.y * 0.5 + other.y * 0.5),
          (this.z * 0.5 + other.z * 0.5)
        );
      }
      
      const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
      const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
      
      return new Quaternion(
        this.w * ratioA + other.w * ratioB,
        this.x * ratioA + other.x * ratioB,
        this.y * ratioA + other.y * ratioB,
        this.z * ratioA + other.z * ratioB
      );
    }

    equals(other) {
      return this.w === other.w && this.x === other.x && 
             this.y === other.y && this.z === other.z;
    }
  }

  // --- ФАБРИКИ КВАТЕРНИОНОВ ---
  function identityQuaternion() {
    return new Quaternion(1, 0, 0, 0);
  }

  function fromAxisAngle(axisX, axisY, axisZ, angleDegrees) {
    const angle = angleDegrees * Math.PI / 180;
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    
    // Normalize axis
    const length = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
    if (length === 0) return identityQuaternion();
    
    return new Quaternion(
      Math.cos(halfAngle),
      (axisX / length) * s,
      (axisY / length) * s,
      (axisZ / length) * s
    );
  }

  function fromEulerAngles(yaw, pitch, roll) {
    // Convert degrees to radians and halve
    const y = yaw * Math.PI / 360;
    const p = pitch * Math.PI / 360;
    const r = roll * Math.PI / 360;
    
    const cy = Math.cos(y);
    const sy = Math.sin(y);
    const cp = Math.cos(p);
    const sp = Math.sin(p);
    const cr = Math.cos(r);
    const sr = Math.sin(r);
    
    return new Quaternion(
      cr * cp * cy + sr * sp * sy,
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy
    );
  }

  // --- ПАРСЕР КВАТЕРНИОНОВ ---
  function parseQuaternion(str) {
    if (typeof str !== "string") str = String(str);
    str = str.trim().replace(/\s+/g, '');
    
    if (str === "0" || str === "") return new Quaternion(0, 0, 0, 0);
    
    // Match components with optional signs
    const wMatch = str.match(/^([+-]?\d*\.?\d*)(?![ijk])/);
    const iMatch = str.match(/([+-]?\d*\.?\d*)i/);
    const jMatch = str.match(/([+-]?\d*\.?\d*)j/);
    const kMatch = str.match(/([+-]?\d*\.?\d*)k/);
    
    const parseComponent = (match, defaultValue = 0) => {
      if (!match) return defaultValue;
      let value = match[1];
      if (value === "+" || value === "") value = "1";
      if (value === "-") value = "-1";
      return parseFloat(value) || defaultValue;
    };
    
    return new Quaternion(
      parseComponent(wMatch, 0),
      parseComponent(iMatch, 0),
      parseComponent(jMatch, 0),
      parseComponent(kMatch, 0)
    );
  }

  // --- БЛОКИ РАСШИРЕНИЯ ---
  function buildQuaternionBlocks(quatArgType) {
    return [
      {
        opcode: 'createQuaternion',
        blockType: BlockType.REPORTER,
        text: 'quaternion w:[W] x:[X] y:[Y] z:[Z]',
        arguments: {
          W: { type: ArgumentType.NUMBER, defaultValue: '1' },
          X: { type: ArgumentType.NUMBER, defaultValue: '0' },
          Y: { type: ArgumentType.NUMBER, defaultValue: '0' },
          Z: { type: ArgumentType.NUMBER, defaultValue: '0' }
        }
      },
      {
        opcode: 'fromAxisAngle',
        blockType: BlockType.REPORTER,
        text: 'quaternion from axis x:[X] y:[Y] z:[Z] angle:[ANGLE]°',
        arguments: {
          X: { type: ArgumentType.NUMBER, defaultValue: '1' },
          Y: { type: ArgumentType.NUMBER, defaultValue: '0' },
          Z: { type: ArgumentType.NUMBER, defaultValue: '0' },
          ANGLE: { type: ArgumentType.NUMBER, defaultValue: '90' }
        }
      },
      {
        opcode: 'fromEuler',
        blockType: BlockType.REPORTER,
        text: 'quaternion from euler yaw:[YAW]° pitch:[PITCH]° roll:[ROLL]°',
        arguments: {
          YAW: { type: ArgumentType.NUMBER, defaultValue: '0' },
          PITCH: { type: ArgumentType.NUMBER, defaultValue: '0' },
          ROLL: { type: ArgumentType.NUMBER, defaultValue: '0' }
        }
      },
      "---",
      {
        opcode: 'getQuatComponent',
        blockType: BlockType.REPORTER,
        text: '[COMPONENT] of [Q]',
        arguments: {
          COMPONENT: {
            type: ArgumentType.STRING,
            menu: 'COMPONENT_MENU'
          },
          Q: { type: quatArgType, defaultValue: '1+0i+0j+0k' }
        }
      },
      {
        opcode: 'getMagnitudeQuat',
        blockType: BlockType.REPORTER,
        text: 'magnitude of [Q]',
        arguments: {
          Q: { type: quatArgType, defaultValue: '1+0i+0j+0k' }
        }
      },
      "---",
      {
        opcode: 'addQuaternions',
        blockType: BlockType.REPORTER,
        text: '[A] + [B]',
        arguments: {
          A: { type: quatArgType, defaultValue: '1+0i+0j+0k' },
          B: { type: quatArgType, defaultValue: '0+1i+0j+0k' }
        }
      },
      {
        opcode: 'multiplyQuaternions',
        blockType: BlockType.REPORTER,
        text: '[A] × [B]',
        arguments: {
          A: { type: quatArgType, defaultValue: '1+0i+0j+0k' },
          B: { type: quatArgType, defaultValue: '0+1i+0j+0k' }
        }
      },
      {
        opcode: 'scaleQuaternion',
        blockType: BlockType.REPORTER,
        text: '[Q] × scalar [S]',
        arguments: {
          Q: { type: quatArgType, defaultValue: '1+2i+3j+4k' },
          S: { type: ArgumentType.NUMBER, defaultValue: '2' }
        }
      },
      "---",
      {
        opcode: 'conjugateQuat',
        blockType: BlockType.REPORTER,
        text: 'conjugate of [Q]',
        arguments: {
          Q: { type: quatArgType, defaultValue: '1+2i+3j+4k' }
        }
      },
      {
        opcode: 'inverseQuat',
        blockType: BlockType.REPORTER,
        text: 'inverse of [Q]',
        arguments: {
          Q: { type: quatArgType, defaultValue: '1+0i+0j+0k' }
        }
      },
      {
        opcode: 'normalizeQuat',
        blockType: BlockType.REPORTER,
        text: 'normalize [Q]',
        arguments: {
          Q: { type: quatArgType, defaultValue: '2+0i+0j+0k' }
        }
      },
      "---",
      {
        opcode: 'rotateVector',
        blockType: BlockType.REPORTER,
        text: 'rotate vector x:[VX] y:[VY] z:[VZ] by [Q]',
        arguments: {
          VX: { type: ArgumentType.NUMBER, defaultValue: '1' },
          VY: { type: ArgumentType.NUMBER, defaultValue: '0' },
          VZ: { type: ArgumentType.NUMBER, defaultValue: '0' },
          Q: { type: quatArgType, defaultValue: '0.707+0.707i+0j+0k' }
        }
      },
      {
        opcode: 'slerp',
        blockType: BlockType.REPORTER,
        text: 'slerp [A] to [B] with t:[T]',
        arguments: {
          A: { type: quatArgType, defaultValue: '1+0i+0j+0k' },
          B: { type: quatArgType, defaultValue: '0+1i+0j+0k' },
          T: { type: ArgumentType.NUMBER, defaultValue: '0.5' }
        }
      },
      "---",
      {
        opcode: 'equalsQuat',
        blockType: BlockType.BOOLEAN,
        text: '[A] = [B]',
        arguments: {
          A: { type: quatArgType, defaultValue: '1+0i+0j+0k' },
          B: { type: quatArgType, defaultValue: '1+0i+0j+0k' }
        }
      },
      {
        opcode: 'isUnitQuat',
        blockType: BlockType.BOOLEAN,
        text: 'is [Q] unit quaternion?',
        arguments: {
          Q: { type: quatArgType, defaultValue: '1+0i+0j+0k' }
        }
      }
    ];
  }

  // --- КЛАСС РАСШИРЕНИЯ КВАТЕРНИОНОВ ---
  class QuaternionsExtension {
    constructor(quatArgType = ArgumentType.STRING) {
      this.quatArgType = quatArgType;
    }

    getInfo() {
      return {
        id: "quaternions",
        name: "Quaternions",
        color1: "#35A2FF",
        color2: "#4FB3FF",
        color3: "#6BC2FF",
        menus: {
          COMPONENT_MENU: {
            acceptReporters: true,
            items: ["w", "x", "y", "z"]
          }
        },
        blocks: buildQuaternionBlocks(this.quatArgType)
      };
    }

    parseQuaternion(str) {
      return parseQuaternion(str);
    }

    // Блоки создания
    createQuaternion(args) {
      return new Quaternion(
        parseFloat(args.W) || 0,
        parseFloat(args.X) || 0,
        parseFloat(args.Y) || 0,
        parseFloat(args.Z) || 0
      ).toString();
    }

    fromAxisAngle(args) {
      return fromAxisAngle(
        parseFloat(args.X) || 0,
        parseFloat(args.Y) || 0,
        parseFloat(args.Z) || 0,
        parseFloat(args.ANGLE) || 0
      ).toString();
    }

    fromEuler(args) {
      return fromEulerAngles(
        parseFloat(args.YAW) || 0,
        parseFloat(args.PITCH) || 0,
        parseFloat(args.ROLL) || 0
      ).toString();
    }

    // Блоки получения свойств
    getQuatComponent(args) {
      const q = this.parseQuaternion(args.Q);
      const component = String(args.COMPONENT).toLowerCase();
      
      switch (component) {
        case "w": return q.w;
        case "x": return q.x;
        case "y": return q.y;
        case "z": return q.z;
        default: return 0;
      }
    }

    getMagnitudeQuat(args) {
      return this.parseQuaternion(args.Q).magnitude();
    }

    // Операции
    addQuaternions(args) {
      return this.parseQuaternion(args.A)
        .add(this.parseQuaternion(args.B))
        .toString();
    }

    multiplyQuaternions(args) {
      return this.parseQuaternion(args.A)
        .multiply(this.parseQuaternion(args.B))
        .toString();
    }

    scaleQuaternion(args) {
      return this.parseQuaternion(args.Q)
        .scale(parseFloat(args.S) || 0)
        .toString();
    }

    conjugateQuat(args) {
      return this.parseQuaternion(args.Q).conjugate().toString();
    }

    inverseQuat(args) {
      return this.parseQuaternion(args.Q).inverse().toString();
    }

    normalizeQuat(args) {
      return this.parseQuaternion(args.Q).normalize().toString();
    }

    // Вращения
    rotateVector(args) {
      const result = this.parseQuaternion(args.Q).rotateVector(
        parseFloat(args.VX) || 0,
        parseFloat(args.VY) || 0,
        parseFloat(args.VZ) || 0
      );
      return `x:${result[0].toFixed(3)} y:${result[1].toFixed(3)} z:${result[2].toFixed(3)}`;
    }

    slerp(args) {
      return this.parseQuaternion(args.A)
        .slerp(this.parseQuaternion(args.B), parseFloat(args.T) || 0)
        .toString();
    }

    // Проверки
    equalsQuat(args) {
      return this.parseQuaternion(args.A).equals(this.parseQuaternion(args.B));
    }

    isUnitQuat(args) {
      const mag = this.parseQuaternion(args.Q).magnitude();
      return Math.abs(mag - 1) < 0.001;
    }
  }

  // --- РЕГИСТРАЦИЯ ---
  function registerQuaternionExtension() {
    try {
      const extension = new QuaternionsExtension(ArgumentType.STRING);
      Scratch.extensions.register(extension);
    } catch (error) {
      console.error("Failed to register Quaternions extension:", error);
    }
  }

  // Запускаем регистрацию
  registerQuaternionExtension();

})(Scratch);