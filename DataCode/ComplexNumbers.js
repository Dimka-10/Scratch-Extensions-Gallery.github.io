// Name: Complex Numbers
// Description: Complex numbers and operations with them. Foundation for quaternions.
// By: Assistant
// License: MIT

((Scratch) => {
  "use strict";

  class Complex {
    constructor(real, imag) {
      this.real = real || 0;
      this.imag = imag || 0;
    }

    toString() {
      if (this.imag === 0) return this.real.toString();
      if (this.real === 0) return this.imag.toString() + "i";
      return this.real + (this.imag >= 0 ? "+" : "") + this.imag + "i";
    }

    magnitude() {
      return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    angle() {
      return Math.atan2(this.imag, this.real);
    }

    conjugate() {
      return new Complex(this.real, -this.imag);
    }

    add(other) {
      return new Complex(this.real + other.real, this.imag + other.imag);
    }

    subtract(other) {
      return new Complex(this.real - other.real, this.imag - other.imag);
    }

    multiply(other) {
      const real = this.real * other.real - this.imag * other.imag;
      const imag = this.real * other.imag + this.imag * other.real;
      return new Complex(real, imag);
    }

    divide(other) {
      const denominator = other.real * other.real + other.imag * other.imag;
      const real = (this.real * other.real + this.imag * other.imag) / denominator;
      const imag = (this.imag * other.real - this.real * other.imag) / denominator;
      return new Complex(real, imag);
    }

    power(exponent) {
      if (exponent === 0) return new Complex(1, 0);
      if (exponent === 1) return this;
      
      const r = this.magnitude();
      const theta = this.angle();
      const newR = Math.pow(r, exponent);
      const newTheta = theta * exponent;
      
      return new Complex(
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
      );
    }

    sqrt() {
      return this.power(0.5);
    }

    exp() {
      const expReal = Math.exp(this.real);
      return new Complex(
        expReal * Math.cos(this.imag),
        expReal * Math.sin(this.imag)
      );
    }

    log() {
      return new Complex(
        Math.log(this.magnitude()),
        this.angle()
      );
    }

    sin() {
      return new Complex(
        Math.sin(this.real) * Math.cosh(this.imag),
        Math.cos(this.real) * Math.sinh(this.imag)
      );
    }

    cos() {
      return new Complex(
        Math.cos(this.real) * Math.cosh(this.imag),
        -Math.sin(this.real) * Math.sinh(this.imag)
      );
    }

    equals(other) {
      return this.real === other.real && this.imag === other.imag;
    }
  }

  class ComplexNumbers {
    getInfo() {
      return {
        id: "complexnumbers",
        name: "Complex Numbers",
        color1: "#FF6B35",
        color2: "#FF8E53",
        color3: "#FFA726",
        
        blocks: [
          {
            opcode: 'createComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'complex number real:[REAL] imag:[IMAG]',
            arguments: {
              REAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: '1' },
              IMAG: { type: Scratch.ArgumentType.NUMBER, defaultValue: '1' }
            }
          },
          {
            opcode: 'createPolar',
            blockType: Scratch.BlockType.REPORTER,
            text: 'complex from polar r:[R] angle:[ANGLE]',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: '1' },
              ANGLE: { type: Scratch.ArgumentType.NUMBER, defaultValue: '45' }
            }
          },
          "---",
          {
            opcode: 'getReal',
            blockType: Scratch.BlockType.REPORTER,
            text: 'real part of [Z]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' }
            }
          },
          {
            opcode: 'getImag',
            blockType: Scratch.BlockType.REPORTER,
            text: 'imaginary part of [Z]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' }
            }
          },
          {
            opcode: 'getMagnitude',
            blockType: Scratch.BlockType.REPORTER,
            text: 'magnitude of [Z]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' }
            }
          },
          {
            opcode: 'getAngle',
            blockType: Scratch.BlockType.REPORTER,
            text: 'angle of [Z] (degrees)',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' }
            }
          },
          "---",
          {
            opcode: 'addComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] + [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: '1+2i' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: '3+4i' }
            }
          },
          {
            opcode: 'subtractComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] - [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: '3+4i' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: '1+2i' }
            }
          },
          {
            opcode: 'multiplyComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] × [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: '1+2i' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: '3+4i' }
            }
          },
          {
            opcode: 'divideComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] ÷ [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: '3+4i' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' }
            }
          },
          "---",
          {
            opcode: 'conjugate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'conjugate of [Z]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+2i' }
            }
          },
          {
            opcode: 'powerComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: '[Z] ^ [POWER]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: '2' }
            }
          },
          {
            opcode: 'sqrtComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: '√[Z]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '4' }
            }
          },
          "---",
          {
            opcode: 'expComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'e^[Z]',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+i' }
            }
          },
          {
            opcode: 'lnComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ln([Z])',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+i' }
            }
          },
          {
            opcode: 'sinComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sin([Z])',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+i' }
            }
          },
          {
            opcode: 'cosComplex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cos([Z])',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1+i' }
            }
          },
          "---",
          {
            opcode: 'equalsComplex',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[A] = [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: '1+1i' }
            }
          },
          {
            opcode: 'isReal',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [Z] real?',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '5' }
            }
          },
          {
            opcode: 'isImaginary',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [Z] imaginary?',
            arguments: {
              Z: { type: Scratch.ArgumentType.STRING, defaultValue: '3i' }
            }
          }
        ]
      };
    }

    parseComplex(str) {
      if (typeof str !== 'string') str = String(str);
      
      // Simple cases
      if (str === 'i') return new Complex(0, 1);
      if (str === '-i') return new Complex(0, -1);
      
      // Real number
      if (!str.includes('i')) {
        return new Complex(parseFloat(str) || 0, 0);
      }
      
      // Imaginary number
      if (!str.match(/[+-]/) && str !== 'i' && str !== '-i') {
        const imagPart = str.replace('i', '');
        return new Complex(0, parseFloat(imagPart === '' ? '1' : imagPart) || 0);
      }
      
      // Full complex number
      const match = str.match(/^([+-]?\d*\.?\d*)([+-]\d*\.?\d*)i$/);
      if (match) {
        const real = parseFloat(match[1] || '0') || 0;
        const imag = parseFloat(match[2] || '1') || (match[2] === '-' ? -1 : 1);
        return new Complex(real, imag);
      }
      
      return new Complex(0, 0);
    }

    createComplex(args) {
      return new Complex(
        parseFloat(args.REAL) || 0,
        parseFloat(args.IMAG) || 0
      ).toString();
    }

    createPolar(args) {
      const r = parseFloat(args.R) || 0;
      const angle = (parseFloat(args.ANGLE) || 0) * Math.PI / 180;
      return new Complex(
        r * Math.cos(angle),
        r * Math.sin(angle)
      ).toString();
    }

    getReal(args) {
      const z = this.parseComplex(args.Z);
      return z.real;
    }

    getImag(args) {
      const z = this.parseComplex(args.Z);
      return z.imag;
    }

    getMagnitude(args) {
      const z = this.parseComplex(args.Z);
      return z.magnitude();
    }

    getAngle(args) {
      const z = this.parseComplex(args.Z);
      return z.angle() * 180 / Math.PI;
    }

    addComplex(args) {
      const a = this.parseComplex(args.A);
      const b = this.parseComplex(args.B);
      return a.add(b).toString();
    }

    subtractComplex(args) {
      const a = this.parseComplex(args.A);
      const b = this.parseComplex(args.B);
      return a.subtract(b).toString();
    }

    multiplyComplex(args) {
      const a = this.parseComplex(args.A);
      const b = this.parseComplex(args.B);
      return a.multiply(b).toString();
    }

    divideComplex(args) {
      const a = this.parseComplex(args.A);
      const b = this.parseComplex(args.B);
      return a.divide(b).toString();
    }

    conjugate(args) {
      const z = this.parseComplex(args.Z);
      return z.conjugate().toString();
    }

    powerComplex(args) {
      const z = this.parseComplex(args.Z);
      const power = parseFloat(args.POWER) || 0;
      return z.power(power).toString();
    }

    sqrtComplex(args) {
      const z = this.parseComplex(args.Z);
      return z.sqrt().toString();
    }

    expComplex(args) {
      const z = this.parseComplex(args.Z);
      return z.exp().toString();
    }

    lnComplex(args) {
      const z = this.parseComplex(args.Z);
      return z.log().toString();
    }

    sinComplex(args) {
      const z = this.parseComplex(args.Z);
      return z.sin().toString();
    }

    cosComplex(args) {
      const z = this.parseComplex(args.Z);
      return z.cos().toString();
    }

    equalsComplex(args) {
      const a = this.parseComplex(args.A);
      const b = this.parseComplex(args.B);
      return a.equals(b);
    }

    isReal(args) {
      const z = this.parseComplex(args.Z);
      return z.imag === 0;
    }

    isImaginary(args) {
      const z = this.parseComplex(args.Z);
      return z.real === 0 && z.imag !== 0;
    }
  }

  Scratch.extensions.register(new ComplexNumbers());
})(Scratch);