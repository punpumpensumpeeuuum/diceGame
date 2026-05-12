import * as THREE from 'three';

class Inputs {
	
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	diceList.forEach(d => {
		const hits = raycaster.intersectObject(d.mesh);
		if (hits.length > 0) {
			d.onClick();
		}
	});
	hand.forEach(c => {
		const hits = raycaster.intersectObject(c.mesh);
		if (hits.length > 0) {
			c.castPlay();
		}
	});
});

window.addEventListener('mousedown', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	hand.forEach(c => {
		const hits = raycaster.intersectObject(c.mesh);
		if (hits.length > 0 && player.canCastSpell(c.color, c.cost)) {
			c.dragging = true;
			// Object.values(player.dropZonesGraphic).forEach(m => m.visible = true);
			rollbutton.style.display = 'none';
			nextturnbutton.style.display = 'none';
		}
	});
});

window.addEventListener('mousemove', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	vec.unproject(camera);
	const dir = vec.clone().sub(camera.position).normalize();
	const dist = -camera.position.z / dir.z;
	const pos = camera.position.clone().add(dir.multiplyScalar(dist));

	const isdrag = hand.some(c => c.dragging);
	const hoveringzone = player.dropCard(pos.x, pos.y);
	Object.entries(player.dropZonesGraphic).forEach(([zon, mesh]) => {
		mesh.visible = isdrag && zon === hoveringzone;
	});

	hand.forEach(c => {
		const hits = raycaster.intersectObject(c.mesh);
		c.hovered = hits.length > 0;
		if (c.dragging) {
			c.mesh.position.x = pos.x;
			c.mesh.position.y = pos.y;
			// player.playingCard(c);
		}
	});
});

window.addEventListener('mouseup', (event) => {
	Object.values(player.dropZonesGraphic).forEach(m => m.visible = false);
	hand.forEach(c => {
		if (!c.dragging) return;
		c.dragging = false;
		const zone = player.dropCard(c.mesh.position.x, c.mesh.position.y);
		console.log(zone);
		if (zone && c.playable) {
			Object.values(player.dropZonesGraphic).forEach(m => m.visible = false);
			c.castPlay();
			updateCardDisplay();
		} else {
			c.mesh.position.x = c.originalX;
			c.mesh.position.y = c.originalY;
		}
		if (diceList[0].numrolls !== 0) rollbutton.style.display = 'flex';
		nextturnbutton.style.display = 'flex';
	});
});