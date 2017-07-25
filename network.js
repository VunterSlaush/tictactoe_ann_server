const synaptic = require('synaptic');
const fs = require('fs');
const networkFileName = "ann.json";
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
      rate: .3,
    	iterations: 2000,
    	error: .005,
    	shuffle: false,
    	log: 100000,
    	cost: Trainer.cost.CROSS_ENTROPY
    });
    res.json({success:true, result:result, sim:sim(param)});
  },

	save: function (res)
	{
		fs.unlinkSync(networkFileName, function (err)
		{
			if(!err)
			{
				fs.writeFile(networkFileName, JSON.stringify(network.toJSON()), function(err)
				{
						if(err) {
								res.json({success:false});
								return;
						}
						res.json({success:true,network:network.toJSON()});
				});
			}
		});
	},

	load: function (res)
	{
		fs.readFile(networkFileName, 'utf8', function(err, data)
		{
			if(err) {
					res.json({success:false});
					return;
			}
			let json = JSON.parse(data);
			network.fromJSON(json);
			res.json({success:true,savedData:json});
		});
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
