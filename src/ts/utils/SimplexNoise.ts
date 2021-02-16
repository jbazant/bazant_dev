// Ported from Stefan Gustavson's java implementation
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
//
// Sean McCullough banksean@gmail.com
//
// Added 4D noise
// Joshua Koo zz85nus@gmail.com
//
// Refactored to typescript
// Jiri Bazant j.bazant@gmail.com

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const F3 = 1 / 3;
const G3 = 1 / 6;
const F4 = (Math.sqrt(5) - 1) / 4;
const G4 = (5 - Math.sqrt(5)) / 20;

const grad3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
];

const grad4 = [
  [0, 1, 1, 1],
  [0, 1, 1, -1],
  [0, 1, -1, 1],
  [0, 1, -1, -1],
  [0, -1, 1, 1],
  [0, -1, 1, -1],
  [0, -1, -1, 1],
  [0, -1, -1, -1],
  [1, 0, 1, 1],
  [1, 0, 1, -1],
  [1, 0, -1, 1],
  [1, 0, -1, -1],
  [-1, 0, 1, 1],
  [-1, 0, 1, -1],
  [-1, 0, -1, 1],
  [-1, 0, -1, -1],
  [1, 1, 0, 1],
  [1, 1, 0, -1],
  [1, -1, 0, 1],
  [1, -1, 0, -1],
  [-1, 1, 0, 1],
  [-1, 1, 0, -1],
  [-1, -1, 0, 1],
  [-1, -1, 0, -1],
  [1, 1, 1, 0],
  [1, 1, -1, 0],
  [1, -1, 1, 0],
  [1, -1, -1, 0],
  [-1, 1, 1, 0],
  [-1, 1, -1, 0],
  [-1, -1, 1, 0],
  [-1, -1, -1, 0],
];

const simplex = [
  [0, 1, 2, 3],
  [0, 1, 3, 2],
  [0, 0, 0, 0],
  [0, 2, 3, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 2, 3, 0],
  [0, 2, 1, 3],
  [0, 0, 0, 0],
  [0, 3, 1, 2],
  [0, 3, 2, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 3, 2, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 2, 0, 3],
  [0, 0, 0, 0],
  [1, 3, 0, 2],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 3, 0, 1],
  [2, 3, 1, 0],
  [1, 0, 2, 3],
  [1, 0, 3, 2],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 3, 1],
  [0, 0, 0, 0],
  [2, 1, 3, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 1, 3],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [3, 0, 1, 2],
  [3, 0, 2, 1],
  [0, 0, 0, 0],
  [3, 1, 2, 0],
  [2, 1, 0, 3],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [3, 1, 0, 2],
  [0, 0, 0, 0],
  [3, 2, 0, 1],
  [3, 2, 1, 0],
];

export class SimplexNoise {
  perm: Array<number> = [];

  constructor(generator?: { random: () => number }) {
    const g = generator ? generator : Math;
    for (let i = 0; i < 256; i++) {
      this.perm[i] = Math.floor(g.random() * 256);
    }

    // To remove the need for index wrapping, double the this.permutation table length
    for (let i = 256; i < 512; i++) {
      this.perm[i] = this.perm[i & 255];
    }
  }

  private _dot(v1: Array<number>, v2: Array<number>) {
    return v2.reduce((acc, _it, index) => v1[index] * v2[index] + acc, 0);
  }

  private _contribution2d(gi: number, x: number, y: number): number {
    const t = 0.5 - x * x - y * y;
    return t > 0 ? Math.pow(t, 4) * this._dot(grad3[gi], [x, y]) : 0;
  }

  private _contribution3d(gi: number, x: number, y: number, z: number): number {
    const t = 0.6 - x * x - y * y - z * z;
    return t > 0 ? Math.pow(t, 4) * this._dot(grad3[gi], [x, y, z]) : 0;
  }

  private _contribution4d(gi: number, x: number, y: number, z: number, w: number): number {
    const t = 0.6 - x * x - y * y - z * z - w * w;
    return t > 0 ? Math.pow(t, 4) * this._dot(grad4[gi], [x, y, z, w]) : 0;
  }

  public noise(xin: number, yin: number): number {
    return this.noise2d(xin, yin);
  }

  public noise2d(xin: number, yin: number): number {
    // Skew the input space to determine which simplex cell we're in
    const s = (xin + yin) * F2; // Hairy factor for 2D
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t; // Unskew the cell origin back to (x,y) space
    const Y0 = j - t;
    const x0 = xin - X0; // The x,y distances from the cell origin
    const y0 = yin - Y0;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;

      // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    } else {
      i1 = 0;
      j1 = 1;
    } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    const x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    const y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
    // Calculate the contribution from the three corners
    const n0 = this._contribution2d(gi0, x0, y0);
    const n1 = this._contribution2d(gi1, x1, y1);
    const n2 = this._contribution2d(gi2, x2, y2);
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  }

  public noise3d(xin: number, yin: number, zin: number): number {
    // Skew the input space to determine which simplex cell we're in
    const s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t; // Unskew the cell origin back to (x,y,z) space
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0; // The x,y,z distances from the cell origin
    const y0 = yin - Y0;
    const z0 = zin - Z0;
    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;

        // X Y Z order
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;

        // X Z Y order
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // Z X Y order
    } else {
      // x0<y0

      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;

        // Z Y X order
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;

        // Y Z X order
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // Y X Z order
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    const x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3; // Offsets for third corner in (x,y,z) coords
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3; // Offsets for last corner in (x,y,z) coords
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;
    // Work out the hashed gradient indices of the four simplex corners
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
    // Calculate the contribution from the four corners
    const n0 = this._contribution3d(gi0, x0, y0, z0);
    const n1 = this._contribution3d(gi1, x1, y1, z1);
    const n2 = this._contribution3d(gi2, x2, y2, z2);
    const n3 = this._contribution3d(gi3, x3, y3, z3);
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32 * (n0 + n1 + n2 + n3);
  }

  public noise4d(x: number, y: number, z: number, w: number): number {
    // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
    const s = (x + y + z + w) * F4; // Factor for 4D skewing
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const l = Math.floor(w + s);
    const t = (i + j + k + l) * G4; // Factor for 4D unskewing
    const X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
    const Y0 = j - t;
    const Z0 = k - t;
    const W0 = l - t;
    const x0 = x - X0; // The x,y,z,w distances from the cell origin
    const y0 = y - Y0;
    const z0 = z - Z0;
    const w0 = w - W0;

    // For the 4D case, the simplex is a 4D shape I won't even try to describe.
    // To find out which of the 24 possible simplices we're in, we need to
    // determine the magnitude ordering of x0, y0, z0 and w0.
    // The method below is a good way of finding the ordering of x,y,z,w and
    // then find the correct traversal order for the simplex we’re in.
    // First, six pair-wise comparisons are performed between each possible pair
    // of the four coordinates, and the results are used to add up binary bits
    // for an integer index.
    const c1 = x0 > y0 ? 32 : 0;
    const c2 = x0 > z0 ? 16 : 0;
    const c3 = y0 > z0 ? 8 : 0;
    const c4 = x0 > w0 ? 4 : 0;
    const c5 = y0 > w0 ? 2 : 0;
    const c6 = z0 > w0 ? 1 : 0;
    const c = c1 + c2 + c3 + c4 + c5 + c6;
    // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
    // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
    // impossible. Only the 24 indices which have non-zero entries make any sense.
    // We use a thresholding to set the coordinates in turn from the largest magnitude.
    // The number 3 in the "simplex" array is at the position of the largest coordinate.
    // The integer offsets for the second simplex corner
    const i1 = simplex[c][0] >= 3 ? 1 : 0;
    const j1 = simplex[c][1] >= 3 ? 1 : 0;
    const k1 = simplex[c][2] >= 3 ? 1 : 0;
    const l1 = simplex[c][3] >= 3 ? 1 : 0;
    // The number 2 in the "simplex" array is at the second largest coordinate.
    // The integer offsets for the third simplex corner
    const i2 = simplex[c][0] >= 2 ? 1 : 0;
    const j2 = simplex[c][1] >= 2 ? 1 : 0;
    const k2 = simplex[c][2] >= 2 ? 1 : 0;
    const l2 = simplex[c][3] >= 2 ? 1 : 0;
    // The number 1 in the "simplex" array is at the second smallest coordinate.
    // The integer offsets for the fourth simplex corner
    const i3 = simplex[c][0] >= 1 ? 1 : 0;
    const j3 = simplex[c][1] >= 1 ? 1 : 0;
    const k3 = simplex[c][2] >= 1 ? 1 : 0;
    const l3 = simplex[c][3] >= 1 ? 1 : 0;
    // The fifth corner has all coordinate offsets = 1, so no need to look that up.
    const x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
    const y1 = y0 - j1 + G4;
    const z1 = z0 - k1 + G4;
    const w1 = w0 - l1 + G4;
    const x2 = x0 - i2 + 2 * G4; // Offsets for third corner in (x,y,z,w) coords
    const y2 = y0 - j2 + 2 * G4;
    const z2 = z0 - k2 + 2 * G4;
    const w2 = w0 - l2 + 2 * G4;
    const x3 = x0 - i3 + 3 * G4; // Offsets for fourth corner in (x,y,z,w) coords
    const y3 = y0 - j3 + 3 * G4;
    const z3 = z0 - k3 + 3 * G4;
    const w3 = w0 - l3 + 3 * G4;
    const x4 = x0 - 1 + 4 * G4; // Offsets for last corner in (x,y,z,w) coords
    const y4 = y0 - 1 + 4 * G4;
    const z4 = z0 - 1 + 4 * G4;
    const w4 = w0 - 1 + 4 * G4;
    // Work out the hashed gradient indices of the five simplex corners
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const ll = l & 255;
    const gi0 = this.perm[ii + this.perm[jj + this.perm[kk + this.perm[ll]]]] % 32;
    const gi1 =
      this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1 + this.perm[ll + l1]]]] % 32;
    const gi2 =
      this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2 + this.perm[ll + l2]]]] % 32;
    const gi3 =
      this.perm[ii + i3 + this.perm[jj + j3 + this.perm[kk + k3 + this.perm[ll + l3]]]] % 32;
    const gi4 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1 + this.perm[ll + 1]]]] % 32;
    // Calculate the contribution from the five corners
    const n0 = this._contribution4d(gi0, x0, y0, z0, w0);
    const n1 = this._contribution4d(gi1, x1, y1, z1, w1);
    const n2 = this._contribution4d(gi2, x2, y2, z2, w2);
    const n3 = this._contribution4d(gi3, x3, y3, z3, w3);
    const n4 = this._contribution4d(gi4, x4, y4, z4, w4);
    // Sum up and scale the result to cover the range [-1,1]
    return 27 * (n0 + n1 + n2 + n3 + n4);
  }
}
