const synaptic = require('synaptic');
const fs = require('fs');
const networkFileName = "ann.json";
const inputs = 9;
const hiddenNeurons = 24;
const output = 4;
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

var network = new Architect.Perceptron(inputs, hiddenNeurons, output);


loadNetwork(function (json)
{
	if(json != null)
		console.log("Cargada ANN desde Archivo");
	else
		console.log("La ANN no pudo ser cargada");
});

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
		fs.truncate(networkFileName,0, function (err)
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
		loadNetwork(function (json)
		{
			if(json != null)
				res.json({success:true,savedData:json});
			else
				res.json({success:false});
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

function loadNetwork(callback)
{
	fs.readFile(networkFileName, 'utf8', function(err, data)
	{
		if(err) {
				callback(null);
		}else
		{
			let json = JSON.parse(data);
			network = Network.fromJSON(json);
			callback(json);
		}

	});
}
