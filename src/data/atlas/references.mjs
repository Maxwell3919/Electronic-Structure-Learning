export const referenceResourceTypes = ['book', 'course', 'website', 'official-documentation', 'database', 'visualization', 'index'];

export const referenceContract = {
  required: ['id', 'type', 'title', 'reason', 'stage', 'scope', 'linksTo', 'source', 'license'],
  linkTargets: ['theory', 'methods', 'computational-tools'],
};

// Atlas v3 不以常见书名填充完成感。资源须经专项核验后逐条进入此数组。
export const referenceResources = [];

export default referenceResources;
