var synaptic = require('synaptic');
const inputs = 9;
const hiddenNeurons = 10;
const output = 4;
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

const network = new Architect.Perceptron(inputs, hiddenNeurons, output);


module.exports =
{
  play:function (param)
  {
    return sim(param);
  },

  train: function(param, target,res)
  {
    let set = [{
      input:param,
      output:target
    }];
    let trainer = new Trainer(network);
    result = trainer.train(set,
    {
      rate: .1,
    	iterations: 20000,
    	error: .0005,
    	shuffle: true,
    	log: 100000,
    	cost: Trainer.cost.CROSS_ENTROPY
    });
    res.json({success:true, result:result, sim:sim(param)});

  }
}

function sim(param)
{

  out = network.activate(param);
  let n = 0;
  for (var i = 0; i < out.length; i++)
  {
    n += Math.round(out[i]) * Math.pow(2,((out.length -1) - i));
  }
  return n;
}
