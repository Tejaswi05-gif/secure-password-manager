const mongoose = require('mongoose');
const Student = require('./models/Student');

mongoose.connect('mongodb://127.0.0.1:27017/passwordManager')
.then(() => console.log('MongoDB Connected'));

async function runAggregation() {

  const rangeAnalysis = await Student.aggregate([
    {
      $bucket: {
        groupBy: '$marks',
        boundaries: [0, 41, 71, 101],
        default: 'Other',
        output: {
          count: { $sum: 1 }
        }
      }
    }
  ]);

  console.log('Range Analysis');
  console.log(rangeAnalysis);

  const sortedStudents = await Student.find()
  .sort({ marks: -1 });

  console.log('Sorted Students');
  console.log(sortedStudents);

  const projection = await Student.find(
    {},
    {
      name: 1,
      marks: 1,
      _id: 0
    }
  );

  console.log('Projection');
  console.log(projection);
}

runAggregation();