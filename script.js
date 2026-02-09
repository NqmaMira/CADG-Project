const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let points = [];
let draggedPoint = null;
const pointRadius = 6;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (points.length > 1) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "#aaa";
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        let steps = 100;
        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let pos = deCasteljauRational(points, t);
            
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
        }
        ctx.stroke();
    }

    points.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = (p === draggedPoint) ? "red" : "#333";
        ctx.fill();
        ctx.fillText("b" + index + " (w=" + p.w.toFixed(1) + ")", p.x + 10, p.y - 10);
    });
}

function getPointUnderMouse(x, y) {
    return points.find(p => Math.sqrt((p.x - x)**2 + (p.y - y)**2) < pointRadius + 5);
}

let selectedPoint = null;

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectedPoint = getPointUnderMouse(x, y);
    if (selectedPoint) {
        draggedPoint = selectedPoint;
        updateUI();
    } else {
        points.push({ x: x, y: y, w: 1.0 });
        selectedPoint = points[points.length - 1];
        updateUI();
    }
    draw();
});

function updateUI() {
    const container = document.getElementById('point-settings');
    if (!selectedPoint) {
        container.innerHTML = "Изберете точка, за да промените теглото ѝ.";
        return;
    }

    let idx = points.indexOf(selectedPoint);
    container.innerHTML = `
        <strong>Точка b${idx}</strong><br>
        Тегло (w): <input type="range" min="0.1" max="10" step="0.1" value="${selectedPoint.w}" id="weight-slider">
        <span id="weight-val">${selectedPoint.w.toFixed(1)}</span>
    `;

    document.getElementById('weight-slider').addEventListener('input', e => {
        selectedPoint.w = parseFloat(e.target.value);
        document.getElementById('weight-val').innerText = selectedPoint.w.toFixed(1);
        draw();
    });
}

window.addEventListener('mousemove', e => {
    if (draggedPoint) {
        const rect = canvas.getBoundingClientRect();
        draggedPoint.x = e.clientX - rect.left;
        draggedPoint.y = e.clientY - rect.top;
        draw();
    }
});

window.addEventListener('mouseup', () => {
    draggedPoint = null;
    draw();
});

function deCasteljauRational(controlPoints, t) {
    let n = controlPoints.length;
    if (n === 0) return null;

    let temp = controlPoints.map(p => ({
        xw: p.x * p.w,
        yw: p.y * p.w,
        w: p.w
    }));

    for (let k = 1; k < n; k++) {
        for (let i = 0; i < n - k; i++) {
            temp[i].xw = (1 - t) * temp[i].xw + t * temp[i + 1].xw;
            temp[i].yw = (1 - t) * temp[i].yw + t * temp[i + 1].yw;
            temp[i].w = (1 - t) * temp[i].w + t * temp[i + 1].w;
        }
    }

    let res = temp[0];
    return {
        x: res.xw / res.w,
        y: res.yw / res.w
    };
}

draw();