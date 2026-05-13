import * as THREE from 'three';

export class Input {
	constructor(camera, diceList, hand, player, gamestate, rolldone, cardplayed) {
		this.camera = camera;
		this.diceList = diceList;
		this.hand = hand;
		this.player = player;
		this.gamestate = gamestate;
		this.rolldone = rolldone;
		this.cardplayed = cardplayed;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.keykey();		
	}

	globalpos(event) { 
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const vec = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
		vec.unproject(this.camera);
		const dir = vec.clone().sub(this.camera.position).normalize();
		const dist = -this.camera.position.z / dir.z;
		return this.camera.position.clone().add(dir.multiplyScalar(dist));
	}

	keykey() {
		window.addEventListener('click', (e) => this.onClick(e));
		window.addEventListener('mousedown', (e) => this.onMouseDown(e));
		window.addEventListener('mousemove', (e) => this.mouseMove(e));
		window.addEventListener('mouseup', (e) => this.onMouseUp(e));
	}

	onClick(event) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		this.diceList.forEach(d => {
			const hit = this.raycaster.intersectObject(d.mesh);
			if (hit.length > 0) d.clicked();
		})
	}

	onMouseDown(event) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		this.hand.forEach(c => {
			const hit = this.raycaster.intersectObject(c.mesh);
			if (hit.length > 0 && this.gamestate.canCastSpell(c.color, c.cost)) {
				c.dragging = true;
			}
		})
	}

	MouseMove(event) {
		const pos = this.globalpos(event);
		const isdrag = this.hand.some(c => c.dragging);
		const hoveringzone = this.player.dropCard(pos.x, pos.y);

		Object.entries(this.player.dropZonesGraphic).forEach(([zon,mesh]) => {
			mesh.visible = isdrag && zon === hoveringzone;
			mesh.material.color.set(0x00ff00);
		});

		this.hand.forEach(c => {
			const hit = this.raycaster.intersectObject(c.mesh);
			c.hovered = hit.length > 0;
			if (c.dragging) {
				c.mesh.position.x = pos.x;
				c.mesh.position.y = pos.y;
			}
		});
	}

	onMouseUp(event) {
		Object.values(this.player.dropZonesGraphic).forEach(m => m.visible = false);
		this.hand.forEach(c => {
			if (!c.dragging) return;
			c.dragging = false;
			const zone = player.dropCard(c.mesh.position.x, c.mesh.position.y);
			console.log(zone);
			if (zone && c.playable) {
				this.gamestate.castSpell(c.color, c.cost);
				c.castPlay();
				updateCardDisplay();
			} else {
				c.mesh.position.x = c.originalX;
				c.mesh.position.y = c.originalY;
			}
		});
	}
}