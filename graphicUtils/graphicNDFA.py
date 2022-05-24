from graphviz import Digraph
import json

jsonFile = open("./NDFA.json")

data = json.load(jsonFile)

automata = data["automata"]
acceptanceStates = data["acceptanceStates"]
initialState = data["initialState"]

dot = Digraph(name="NDFA")
dot.attr(rankdir="LR", size="10")

dot.attr("node", shape="circle", style="filled", fillcolor="#26C485")
for currentState in range(len(acceptanceStates)):
    dot.node(str(acceptanceStates[currentState]))

dot.attr("node", shape="circle", style="filled", fillcolor="#8a8aff")
for currentState in range(len(initialState)):
    dot.node(str(initialState[currentState]))
    
dot.attr("node", shape="circle", style="filled", fillcolor="#f64747")
for transition in range(len(automata)):
    dot.edge(str(automata[transition]["initialState"]), str(automata[transition]["finalState"]), label= str(automata[transition]["symbol"]))

dot.render("graphs/NDFA.gv", view=True)