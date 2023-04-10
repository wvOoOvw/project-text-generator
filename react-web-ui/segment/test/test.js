/**
 * 测试
 */
 
var Segment = require('../index').Segment;
var POSTAG = require('../index').POSTAG; 
var fs = require('fs');

var NUM = 1;
var text = '\
随着智能化住宅小区的普及和宽带接入技术的发展，各种基于宽带技术的应用服务也日益被人们所熟悉。\
';
text = '是的.大家以后说话都要注意一点..他喜欢咬人...';
text = '敲诈他就等于敲诈我自己';
text = '他就等于';
text = '被人们所熟悉。';
text = '李小明的智能化住宅AK';
text = '但91%的企业表示其技术工人的技术能力不能完全胜任企业引进高新技术或进行技术改造的任务';
text = '这项调查对设计基于分词技术的新一代中文搜索引擎将是一个颇具价值的基础性工作。作者简介孙茂松清华大学计算机科学与技术系副主任，研究领域为中文信息处理和人工智能。主持多项国家重点基础研究发展规划项目二级课题、国家自然科学基金项目';
text = '国家自然科学基金项目';
text = '司马光在喝娃哈哈AD钙奶，上官小明在唱歌。刘德华带着张惠妹在周星驰家喝水，突然刮起了谢霆风，从水中出了一条吴奇龙，吴奇龙手持郑伊剑，骑着黄家驹，抢走了张惠妹；刘德华手持周华剑，踏着温兆轮，翻过了赵本山，穿过了关芝林，跃过了潘长江，抢回了张惠妹，回到了郭富城，还在城中挂起了一面任贤旗!';
text = '周星驰说：“老狗要淡定”';
text = '小明和小白坐在石头上';
text = '在公司呆了一年多，几乎每天都是12点钟之后回去，有时还不回去，上次体检之后明显感觉自己身体不如以前，很容易就感觉疲惫。';
text = '从形式上看，词是稳定的字的组合，因此在上下文中，相邻的字同时出现的次数越多，就越有可能构成一个词。因此字与字相邻共现的频率或概率能够较好的反映成词的可信度。可以对语料中相邻共现的各个字的组合的频度进行统计，计算它们的互现信息。定义两个字的互现信息，计算两个汉字X、Y的相邻共现概率。互现信息体现了汉字之间结合关系的紧密程度。当紧密程度高于某一个阈值时，便可认为此字组可能构成了一个词。这种方法只需对语料中的字组频度进行统计，不需要切分词典，因而又叫做无词典分词法或统计取词方法。但这种方法也有一定的局限性，会经常抽出一些共现频度高、但并不是词的常用字组，例如“这一”、“之一”、“有的”、“我的”、“许多的”等，并且对常用词的识别精度差，时空开销大。实际应用的统计分词系统都要使用一部基本的分词词典（常用词词典）进行串匹配分词，同时使用统计方法识别一些新的词，即将串频统计和串匹配结合起来，既发挥匹配分词切分速度快、效率高的特点，又利用了无词典分词结合上下文识别生词、自动消除歧义的优点。 ';
text = '明星们的名字顺口溜';
text = '回到家后，马成俊买了一本全国地图册，利用闲暇时间开始了解、整理全国所有地级市的名称。而这一切，对于只有小学五年级文化的他来说，难度可想而知。看到很多不认识的字，马成俊不仅虚心向周围的人请教，还借来新华字典查阅。两个月后，他终于将全国347个地级市的名称整理了出来，然后又投入了更艰巨的工作——编顺口溜。';
text = '长春市长春药店';
text = 'AK47-ISO-9001吖体系认证';
text = '工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。';
text = '每月经过';
text = '24口交换机';
text = '这是一个伸手不见五指的黑夜。我叫孙悟空，我爱北京，我爱Python和C++。';
text = '我不喜欢日本和服。';
text = '雷猴回归人间。';
text = '工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作';
text = '我需要廉租房';
text = '永和服装饰品有限公司';
text = '我爱北京天安门';
text = 'abc';
text = '隐马尔可夫';
text = '雷猴是个好网站';
text = '“Microsoft”一词由“MICROcomputer（微型计算机）”和“SOFTware（软件）”两部分组成';
text = '草泥马和欺实马是今年的流行词汇';
text = '伊藤洋华堂总府店';
text = '中国科学院计算技术研究所';
text = '罗密欧与朱丽叶';
text = '我有一台Nokia-N900';
//text = fs.readFileSync('./old/text1.txt', 'utf8');
text = '本科班学生';
text = '随后即出演个人第一部电影';
text = '从小即显露出过人的艺术天赋';
text = '电影双面齐发力';
text = '景甜身上所散发出的甜美气质和甜甜的笑容';
text = '是风格迥异的三首歌曲';
text = '甜甜的笑容就给华盛顿州长留下了美好的印象';
text = '她给华盛顿州长留下了美好的印象';
text = '张亚东为其量身打造';
text = '1989年景甜出生于西安市。';
text = '景甜不会node.js';
text = '如果气温降到10度，我就不洗澡了。';
text = '关电脑，关计算机，关机';
text = '老雷对老狗说：您要淡定';
text = '你是李家的人？';
text = '看你要用到什么场景撒。';
text = '阿西啊，好吧，基本懂了';
text = '我觉得如果没有涉及到IO操作，没必要全按回调方式来写';
text = '一加一等于２ａｂｃＡＢＣ砼';
text = '小王和小白坐在石头上。';
text = '哈哈http://segment.cnodejs.net/欢迎测试http://www.baidu.com/';
text = 'http://www.hylanda.com/post.php?mid=4&aid=15';
text = '谢娜喜欢上http://baidu.com搜索东西';
text = '这项调查对设计基于分词技术的新一代中文搜索引擎将是一个颇具价值的基础性工作。作者简介孙茂松清华大学计算机科学与技术系副主任，研究领域为中文信息处理和人工智能。主持多项国家重点基础研究发展规划项目二级课题、国家自然科学基金项目';
text = '交谈中请勿轻信汇款、中奖信息、陌生电话，勿使用外挂软件。';
text = '老雷最近一直研究这个做啥呢';
text = '这是一个基 于Node.js的中文分词模块。\n\n\n\n欢迎拍砖';
text = '张三说的确实在理。';
text = '李三买了一张三角桌子。';
text = '王五和张三丰、李强是谁？';
text = '我叫雷宗民，宗民，雷哥，民哥';
text = '一次性交一百元';
text = '欲加之罪何患无辞';
text = '今年是2011年，现在是2011年12月30日五点四十分';
text = '2011年度1989年景甜出生于西安市两百二百12月老师讲课';
text = '2011年度';
text = '一百步伐木法';
text = '二百厘米，五万万人民';
text = '我的邮箱地址是leizongmin@gmail.com，mail-me@mail.ucdok.com';
text = 'PI=3.141592654.哈哈';
text = '我的QQ刚刚被挤下去了';
text = '那些词恐怕谁也不知道，这个算不算很高深？到底有没有？';
text = '@健康是唯一：【冬天喝茶有忌讳】茶水虽好，但在冬季，由于温度和湿度的大幅度变化，因而还是有一些人群是不适宜喝茶的。1：孕妇不宜喝茶2：经期不要喝茶3：老人冬季少喝茶4：喝茶就喝红茶+枣5：不要空腹饮茶6：不要喝烫茶7：不要喝浓茶~~（珍爱健康，请关注@健康是唯一）';
text = '这是谁家小孩';
text = '安以轩是谁？';//你知道不知道。广东省广州市海珠区';
text = '童安格(Augus Tung),集作曲、作词、演唱于一身,是典型的浪漫主义爱情故事的发言人。他1996年参加中央电视台春节联欢晚会,演唱歌曲《畅饮回忆》,是国内较早深受欢迎的';
text = '不可以啊';
text = '分词正确率高达97.58%(即百分之九十七点五八，973专家评测结果)';
text = '十五分之一是多少？零点零六六七分之九.5';
text = '她十二岁时是班花';
text = '化妆和服装';
text = '“王军虎”还能不能算词?真是个大难题。';
text = '研究生命起源';
text = '此文章作者是微软系的';
text = '所以系统内应该早就装上了';
text = '作者简介:孙茂松,清华大学计算机科学与技术系副主任';
text = '中文是一种十分复杂的语言，让计算机理解中文语言更是困难。';
text = '复方分词法产品名';
text = '省略语等都是很难处理的问题';
text = '到底哪种分词算法的准确度更高';
text = '相当于用中药中的复方概念，真是一语中的。';
text = '用不同的药材综合起来去医治疾病';
text = '各位大牛如果发现已有的东西';//，千万要告知我啊。';
text = '没办法';
text = '10个100%纯度的';
text = '中国，是一个 多民族的国家。leizongmin@qq.com http://baidu.com哈哈';
//text = '打开{http://site.com}网站';
text = '「美图区」';
text = '我正在参加抽奖活动：#2013易迅送你快乐到家#，奖品丰厚，你也赶快来参加吧！活动地址：http://url.cn/Ds2hyz @wzgdmje';

var s = new Date().getTime();
var segment = new Segment();
// 使用默认的识别模块及字典
segment.useDefault();
//segment.loadDict(__dirname + '/a1.txt');
console.log(Object.keys(segment.DICT.TABLE).length);
//segment.use(['URLTokenizer', 'PunctuationTokenizer', 'ForeignTokenizer', 'SingleTokenizer', 'EmailOptimizer']);
var e = new Date().getTime();
console.log('init segment spent ' + ((e - s) / NUM) + 'ms');


var s = new Date().getTime();
for (var i = 0; i < NUM; i++)
////////////////////////////////////////////////////////////

  var ret = segment.doSegment(text);

////////////////////////////////////////////////////////////
var e = new Date().getTime();
var line = '';
for (var i in ret) {
  line += ret[i].w + '/';
  ret[i].ps = POSTAG.chsName(ret[i].p);
}
console.log(ret);
console.log(line);
console.log('spent ' + ((e - s) / NUM) + 'ms');
return;
console.log(segment.toString(ret));
var split = segment.split(ret, '是');
for (var i in split)
  console.log(segment.toString(split[i]));
console.log(segment.indexOf(ret, '的', 3));