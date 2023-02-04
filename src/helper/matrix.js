const perspective = (fov, aspect, near, far) => {
	let f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (far + near) / (near - far), -1,
		0, 0, (2 * far * near) / (near - far), 0
	]
}

const orthographic = (l, r, b, t, n, f) => {
	let invX = 2/(r-l);
	let invY = 2/(t-b);
	let invZ = 2/(n-f);

	return [
		invX, 0, 0, 0,
		0, invY, 0, 0,
		0, 0, invZ, 0,
		(l+r)/(l-r), (b+t)/(b-t), (n+f)/(n-f), 1
	]
}


const  oblique = (l, r, b, t, n, f, a) => {
		a = toRad(a);
		let theta = 75.0;
		let phi = 85.0;
		let cottheta = 1 / Math.tan((theta / 180.0) * Math.PI);
		let cotphi = 1 / Math.tan((phi / 180.0) * Math.PI);

    // const s = 0.5 * Math.sin(a);
    // const c = 0.5 * Math.cos(a);
    const shearMat = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        -cottheta, -cotphi, 1, 0,
        0, 0, 0, 1,
    ]
    const orthographicMat = orthographic(l, r, b, t, n, f);
    return mmultiply(orthographicMat, shearMat);
}


const translate = (mat, x, y, z) => {
	return [
		mat[0], mat[1], mat[2], mat[3],
		mat[4], mat[5], mat[6], mat[7],
		mat[8], mat[9], mat[10], mat[11],
		mat[0] * x + mat[4] * y + mat[8] * z + mat[12],
		mat[1] * x + mat[5] * y + mat[9] * z + mat[13],
		mat[2] * x + mat[6] * y + mat[10] * z + mat[14],
		mat[3] * x + mat[7] * y + mat[11] * z + mat[15]
	]
}

const rotateX = (mat, angle, xmid, ymid, zmid) => {
	let c = Math.cos(angle);
	let s = Math.sin(angle);

	mat = translate(mat, xmid, ymid, zmid);

	mat = [
		mat[0], mat[1], mat[2], mat[3],
		mat[4] * c + mat[8] * s,
		mat[5] * c + mat[9] * s,
		mat[6] * c + mat[10] * s,
		mat[7] * c + mat[11] * s,
		mat[8] * c - mat[4] * s,
		mat[9] * c - mat[5] * s,
		mat[10] * c - mat[6] * s,
		mat[11] * c - mat[7] * s,
		mat[12], mat[13], mat[14], mat[15]
	]

	mat = translate(mat, -xmid, -ymid, -zmid);
	return mat;
}

const rotateY = (mat, angle, xmid, ymid, zmid) => {
	let c = Math.cos(angle);
	let s = Math.sin(angle);

	mat = translate(mat, xmid, ymid, zmid);

	mat =  [
		mat[0] * c - mat[8] * s,
		mat[1] * c - mat[9] * s,
		mat[2] * c - mat[10] * s,
		mat[3] * c - mat[11] * s,
		mat[4], mat[5], mat[6], mat[7],
		mat[8] * c + mat[0] * s,
		mat[9] * c + mat[1] * s,
		mat[10] * c + mat[2] * s,
		mat[11] * c + mat[3] * s,
		mat[12], mat[13], mat[14], mat[15]
	]

	mat = translate(mat, -xmid, -ymid, -zmid);
	return mat;
}

const rotateZ = (mat, angle, xmid, ymid, zmid) => {
	let c = Math.cos(angle);
	let s = Math.sin(angle);

	mat = translate(mat, xmid, ymid, zmid);

	mat = [
		mat[0] * c + mat[4] * s,
		mat[1] * c + mat[5] * s,
		mat[2] * c + mat[6] * s,
		mat[3] * c + mat[7] * s,
		mat[4] * c - mat[0] * s,
		mat[5] * c - mat[1] * s,
		mat[6] * c - mat[2] * s,
		mat[7] * c - mat[3] * s,
		mat[8], mat[9], mat[10], mat[11],
		mat[12], mat[13], mat[14], mat[15]
	]

	mat = translate(mat, -xmid, -ymid, -zmid);
	return mat;

}

const rotateCameraX = (mat, angle) => {
	let c = Math.cos(angle);
	let s = Math.sin(angle);

	mat = [
		mat[0], mat[1], mat[2], mat[3],
		mat[4] * c + mat[8] * s,
		mat[5] * c + mat[9] * s,
		mat[6] * c + mat[10] * s,
		mat[7] * c + mat[11] * s,
		mat[8] * c - mat[4] * s,
		mat[9] * c - mat[5] * s,
		mat[10] * c - mat[6] * s,
		mat[11] * c - mat[7] * s,
		mat[12], mat[13], mat[14], mat[15]
	]
	return mat;
}

const rotateCameraY = (mat, angle) => {
	let c = Math.cos(angle);
	let s = Math.sin(angle);

	mat =  [
		mat[0] * c - mat[8] * s,
		mat[1] * c - mat[9] * s,
		mat[2] * c - mat[10] * s,
		mat[3] * c - mat[11] * s,
		mat[4], mat[5], mat[6], mat[7],
		mat[8] * c + mat[0] * s,
		mat[9] * c + mat[1] * s,
		mat[10] * c + mat[2] * s,
		mat[11] * c + mat[3] * s,
		mat[12], mat[13], mat[14], mat[15]
	]

	return mat;
}

const scaler = (mat, x, y, z) => {
	return [
		mat[0] * x, mat[1] * x, mat[2] * x, mat[3] * x,
		mat[4] * y, mat[5] * y, mat[6] * y, mat[7] * y,
		mat[8] * z, mat[9] * z, mat[10] * z, mat[11] * z,
		mat[12], mat[13], mat[14], mat[15]
	]
}

const mmultiply = (mat1, mat2)=> {
	let res = []

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0.0
            for (let k = 0; k < 4; k++) {
                sum += mat1[i*4 + k] * mat2[k*4 + j]
            }
            res.push(sum)
        }
    }
    return res
}

const transpose = (pMatrix) => {
	return [
		pMatrix[0], pMatrix[4], pMatrix[8], pMatrix[12],
		pMatrix[1], pMatrix[5], pMatrix[9], pMatrix[13],
		pMatrix[2], pMatrix[6], pMatrix[10], pMatrix[14],
		pMatrix[3], pMatrix[7], pMatrix[11], pMatrix[15],
	]
}

const inverse = (m) => {
	var m00 = m[0 * 4 + 0];
	var m01 = m[0 * 4 + 1];
	var m02 = m[0 * 4 + 2];
	var m03 = m[0 * 4 + 3];
	var m10 = m[1 * 4 + 0];
	var m11 = m[1 * 4 + 1];
	var m12 = m[1 * 4 + 2];
	var m13 = m[1 * 4 + 3];
	var m20 = m[2 * 4 + 0];
	var m21 = m[2 * 4 + 1];
	var m22 = m[2 * 4 + 2];
	var m23 = m[2 * 4 + 3];
	var m30 = m[3 * 4 + 0];
	var m31 = m[3 * 4 + 1];
	var m32 = m[3 * 4 + 2];
	var m33 = m[3 * 4 + 3];
	var tmp_0  = m22 * m33;
	var tmp_1  = m32 * m23;
	var tmp_2  = m12 * m33;
	var tmp_3  = m32 * m13;
	var tmp_4  = m12 * m23;
	var tmp_5  = m22 * m13;
	var tmp_6  = m02 * m33;
	var tmp_7  = m32 * m03;
	var tmp_8  = m02 * m23;
	var tmp_9  = m22 * m03;
	var tmp_10 = m02 * m13;
	var tmp_11 = m12 * m03;
	var tmp_12 = m20 * m31;
	var tmp_13 = m30 * m21;
	var tmp_14 = m10 * m31;
	var tmp_15 = m30 * m11;
	var tmp_16 = m10 * m21;
	var tmp_17 = m20 * m11;
	var tmp_18 = m00 * m31;
	var tmp_19 = m30 * m01;
	var tmp_20 = m00 * m21;
	var tmp_21 = m20 * m01;
	var tmp_22 = m00 * m11;
	var tmp_23 = m10 * m01;

	var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
			(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
			(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
			(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
			(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	return [
		d * t0,
		d * t1,
		d * t2,
		d * t3,
		d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
					(tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
		d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
					(tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
		d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
					(tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
		d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
					(tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
		d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
					(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
		d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
					(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
		d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
					(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
		d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
					(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
		d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
					(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
		d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
					(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
		d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
					(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
		d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
					(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
	];
}

