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

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedPoint = getPointUnderMouse(x, y);
    if (clickedPoint) {
        draggedPoint = clickedPoint;
    } else {
        points.push({ x: x, y: y, w: 1.0 });
    }
    draw();
});

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

draw();