
var data = [
    {
        id: 1,
        name: "Barbell push press",
        reps: 6,
        sets: 4,
        rest: 120,
        imageUrl: "https://cdn.mos.cms.futurecdn.net/jpHXHGv9zGvW2Ngu3eEnxL.jpg",
        videoUrl: "https://www.youtube.com/watch?v=iaBVSJm78ko"
    },
    {
        id:2,
        name: "Bench press",
        reps: 12,
        sets: 4,
        rest: 80,
        imageUrl: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2022/01/Intermediate-bench-press-program.jpg?resize=2048%2C1365&ssl=1",
        videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg"
    },
    {
        id:3,
        name: "Barbell bicep curls",
        reps: 10,
        sets: 5,
        rest: 120,
        imageUrl: "https://m.media-amazon.com/images/I/51dstxdmrcL._AC_SY780_.jpg",
        videoUrl: "https://www.youtube.com/watch?v=QZEqB6wUPxQ&t=36s"
    }
]

var excercises = [];

function getAllData(){
    return data;
}

function getDataById(id){
    console.log("getDataById called, id: "+ id);
    let result = data.find(x => x.id == id);
    console.log("data: " + JSON.stringify(data));
    console.log("result: " + JSON.stringify(result));
    return result;
}

function resetWorkout(){
    excercises = data;
}

function getExercise() {
    if (excercises.length != 0) {
        let exercise = excercises[0];
        excercises.shift();
        return exercise;
    }

    return null;
}

export {
    getAllData,
    getDataById,
    resetWorkout,
    getExercise
}