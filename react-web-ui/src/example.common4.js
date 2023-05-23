const runPrompt = ``

const trainPrompt =
`
这是我刚刚进入到公司一段时间之后记录的，我因为刚刚进入公司所以对公司的业务以及我要去做的一些事情都不是了解，在一开始的时候我们部门的主管会指引我到属于的工作区域、带领我熟悉一下工作环境、告诉我以后工作跟随的上司是谁等等这些琐事。之后我大致知道自己的工作职责是什么，因为我的职位是自媒体运营实习，我的主要职责是负责公司自媒体平台的日常运营、配合团队完成用户的整体增长目标、负责公司公众号、微博、头条、抖音、小红书、官方网站等平台内容的撰写并完成发布工作等等有关自媒体、网络的任务。并且我还要帮助我的上司去完成一些视频剪辑、美工、协助拍摄的任务。以上就是我刚进入公司实习，通过前几天的学习所得到的收获，因为还没有熟悉公司业务所以业务做的比较少，更多的还是熟悉工作环境和工作职能。

中国的发展从古至今已经有六十年多了，一直秉持着社会主义的发展是中国的独有特色。相比与其他国家的资本主义发展，中国坚定不移地以社会主义发展为发展宗旨，这一行为看似简单实施起来则是困难。这对于国家领导人的能力更是一种挑战，在毛泽东带领之下的中国不断地快速发展，并且不忘社会主义的初衷，以人人为我、我为人人的群众思想发展。这是我国特色社会主义理论的雏形。习近平也在多次的公开演讲中说到，中国依旧会坚持社会主义发展进行建设，不忘初心是中国发展首要目标。可见特色社会主义理论对于中国的发展起到了很大的作用，民心所向决定了一个国家是否兴盛。然而社会主义发展正是注重群众的想法，与资本主义不同，不会将金钱和其他硬性指标作为国家发展的唯一标准线，社会主义更加致力于取悦群众的需求。这么一种民心所向的国家发展方向致使了中国可以变成现在这么的国际大国，中国特色社会主义理论从毛泽东领导时到现在的习近平领导从没有断过，中国的发展沿袭了毛泽东那个年代时定下的发展目标。中国特色社会主义理论的价值体现在国家的建设以及群众的思想，首先在国家的建设上，因为我国是社会主义国家所以党的思想、领导人的执政，这些都是要以群众的利益为出发点而去行为，与资本主义不同，不能为了国家的发展而舍弃了群众的自由或者是利益。其次从群众的思想上来说，社会主义代表着我为人人、人人为我的思想，国家的建设过程中不断地对群众灌输社会主义的思想也是建设的内容之一。只有当一个国家的群众都是为了社会的发展和共同的利益而行为时，国家才能真正达到社会主义的层次，取得更好的发展。所以，中国特色社会主义理论对于中国的发展起到了很大的作用，也是中国发展必不可缺的理论，其拥有着很高的价值。

汽车车身种类大致有五种分类方式，车身用途分类、车身壳体结构形式分类、车身受力情况分类、汽车尺寸分类、汽车车身结构分类。具体将以车身壳体、车身受力、车身结构三个方面来具体介绍。按照车身壳体进行结构形式的分类，有三种分类情况。整体式无骨架结构利用各种蒙皮板来代替骨架，由于其拥有连接时所产生的加强筋从而可以代替骨架起到稳定的作用。车架式结构具有完整的骨架结构，车身是固定在骨架上的。半车架式结构仅仅只有部分的骨架作为车身的依靠，例如拥有单独的立柱以及单独的加固件，这些部分的骨架式相互连通的或者是依靠蒙皮板相连的。一般客车和拥有较大车厢的汽车会采用无骨架结构较多。而汽车则采用车架式结构较为普遍。按照车身的受力情况分类，有三种分类情况。承载式车身利用取消车架这一特性来实现了将所有荷载都放在车身上，致使底盘中的部件可以连接车身。这种车身设计更加拥有相较于其他设计更加轻的质量以及更好的刚度。非承载式车身是在考虑到车身不承受汽车载荷的前提之下而利用弹性元件与车架连接，这就可以让车身拥有较好的稳定性，同时设计和生产也较为简单。另有中和的半承载式车身设计，让车身承受部分的载荷，利用刚性连接车身和车架来达到这一目的。按照车身结构分类，拥有较多的分类。较为常见的普通汽车结构拥有前后座以及四门，这是最为常见的车身结构也是使用最频繁的结构之一。硬顶汽车结构和普通汽车结构相似，但不同的是将金属作为顶盖，而且一般是没有门柱的。敞篷车结构拥有顶棚这一特性，可以随时打开或是关闭顶棚以给使用者良好的体验，与硬顶汽车相似的是同样没有门柱。轻型卡车也较为常见，特点在于后部分的货箱和驾驶室是独立分开的，一般采用前置后驱的驱动系统。多功能车结构能够在沙地、雪地或是其他崎岖的道路上行驶，其离地间隙相较于普通车结构要低，属于越野车范畴。

`

const name = '测试'

const recordContextLength = 8

const description = '测试...'

export default { library: () => import('./example.common4.json'), runPrompt, trainPrompt, name, description, recordContextLength }